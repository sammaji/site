import { NextResponse } from "next/server";

const REQUEST_TIMEOUT_MS = 8000;
const RATE_LIMIT_MAX_REQUESTS = 1000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const HARD_CRAWL_PAGE_CAP = 1000;
const MAX_CRAWL_DEPTH = 7;
const MAX_CHILD_LINKS_PER_PAGE = 30;
const MAX_PAGES_PER_SECTION = 220;
const CRAWL_CONCURRENCY = 8;
const MAX_SITEMAP_DISCOVERY = HARD_CRAWL_PAGE_CAP * 4;
const DEPTH_PAGE_CAPS = [1, 120, 180, 220, 180, 130, 100, 69] as const;

const USER_AGENT =
	"Mozilla/5.0 (compatible; LLMSTxtGenerator/1.0; +https://localhost:3000)";

type GenerateRequest = {
	url?: string;
};

type PageSummary = {
	url: string;
	title: string;
	summary: string;
};

type RemotePayload = {
	text: string;
	contentType: string;
};

type RateLimitEntry = {
	windowStart: number;
	count: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
	__llmsTextRateLimitStore?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
	globalRateLimitStore.__llmsTextRateLimitStore ??
	new Map<string, RateLimitEntry>();
if (!globalRateLimitStore.__llmsTextRateLimitStore) {
	globalRateLimitStore.__llmsTextRateLimitStore = rateLimitStore;
}

const htmlEntityMap: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
};

const blockedExtensions = new Set([
	".jpg",
	".jpeg",
	".png",
	".gif",
	".svg",
	".webp",
	".avif",
	".ico",
	".pdf",
	".zip",
	".tar",
	".gz",
	".js",
	".css",
	".json",
	".xml",
	".mp4",
	".mp3",
	".mov",
	".webm",
]);

function cleanWhitespace(value: string): string {
	return value.replace(/\s+/g, " ").trim();
}

function getClientIp(request: Request): string {
	const forwardedFor = request.headers.get("x-forwarded-for");
	if (forwardedFor) {
		const firstForwarded = forwardedFor.split(",")[0]?.trim();
		if (firstForwarded) {
			return firstForwarded;
		}
	}

	for (const headerName of ["cf-connecting-ip", "x-real-ip", "x-client-ip"]) {
		const headerValue = request.headers.get(headerName)?.trim();
		if (headerValue) {
			return headerValue;
		}
	}

	return "unknown";
}

function checkRateLimit(ip: string): {
	allowed: boolean;
	remaining: number;
	retryAfterSeconds: number;
} {
	const now = Date.now();

	if (rateLimitStore.size > 6000) {
		for (const [key, value] of rateLimitStore.entries()) {
			if (now - value.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
				rateLimitStore.delete(key);
			}
		}
	}

	const entry = rateLimitStore.get(ip);
	if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
		rateLimitStore.set(ip, { count: 1, windowStart: now });
		return {
			allowed: true,
			remaining: RATE_LIMIT_MAX_REQUESTS - 1,
			retryAfterSeconds: 0,
		};
	}

	if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
		const retryAfterSeconds = Math.max(
			1,
			Math.ceil(
				(RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000,
			),
		);

		return {
			allowed: false,
			remaining: 0,
			retryAfterSeconds,
		};
	}

	entry.count += 1;
	rateLimitStore.set(ip, entry);
	return {
		allowed: true,
		remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
		retryAfterSeconds: 0,
	};
}

function decodeHtmlEntities(value: string): string {
	return value.replace(
		/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,
		(_, entity: string) => {
			if (entity.startsWith("#x") || entity.startsWith("#X")) {
				const code = Number.parseInt(entity.slice(2), 16);
				return Number.isNaN(code) ? _ : String.fromCodePoint(code);
			}

			if (entity.startsWith("#")) {
				const code = Number.parseInt(entity.slice(1), 10);
				return Number.isNaN(code) ? _ : String.fromCodePoint(code);
			}

			return htmlEntityMap[entity] ?? _;
		},
	);
}

function stripHtml(value: string): string {
	const withoutScripts = value
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

	return cleanWhitespace(
		decodeHtmlEntities(withoutScripts.replace(/<[^>]+>/g, " ")),
	);
}

function truncate(value: string, max = 180): string {
	if (value.length <= max) {
		return value;
	}

	return `${value.slice(0, max).trimEnd()}...`;
}

function firstMatch(value: string, regex: RegExp): string | null {
	const match = value.match(regex);
	if (!match?.[1]) {
		return null;
	}

	const cleaned = cleanWhitespace(decodeHtmlEntities(match[1]));
	return cleaned.length > 0 ? cleaned : null;
}

function ensureUrl(input: string): URL | null {
	const trimmed = input.trim();
	if (!trimmed) {
		return null;
	}

	const candidate =
		/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

	try {
		const url = new URL(candidate);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return null;
		}

		return url;
	} catch {
		return null;
	}
}

function normalizeUrl(rawUrl: URL | string): string {
	const url =
		typeof rawUrl === "string" ?
			new URL(rawUrl)
		:	new URL(rawUrl.toString());
	url.hash = "";
	url.search = "";
	if (!url.pathname) {
		url.pathname = "/";
	}
	if (url.pathname !== "/" && url.pathname.endsWith("/")) {
		url.pathname = url.pathname.slice(0, -1);
	}

	return url.toString();
}

function urlLooksLikeHtmlPage(url: URL): boolean {
	const lowerPathname = url.pathname.toLowerCase();
	for (const extension of blockedExtensions) {
		if (lowerPathname.endsWith(extension)) {
			return false;
		}
	}
	return true;
}

function relativePath(url: URL): string {
	return url.pathname === "/" ? "home" : url.pathname.replace(/^\/+/, "");
}

function titleFromUrl(url: URL): string {
	const path = relativePath(url);
	if (path === "home") {
		return "Home";
	}

	const words = path
		.split("/")
		.map(chunk => chunk.replace(/[-_]/g, " "))
		.join(" ")
		.trim();
	if (!words) {
		return "Untitled page";
	}

	return words.replace(/\b\w/g, c => c.toUpperCase());
}

function scoreCandidateUrl(url: URL): number {
	if (!urlLooksLikeHtmlPage(url)) {
		return -200;
	}

	let score = 0;
	const pathname = url.pathname.toLowerCase();
	const segments = pathname.split("/").filter(Boolean);

	if (pathname === "/" || pathname === "") {
		score += 100;
	}
	score += Math.max(0, 25 - segments.length * 4);

	const weightedSegments: Record<string, number> = {
		docs: 30,
		documentation: 30,
		api: 28,
		guide: 24,
		blog: 20,
		product: 20,
		features: 18,
		pricing: 18,
		about: 18,
		contact: 16,
		support: 16,
		faq: 16,
		help: 15,
		terms: 8,
		privacy: 8,
	};

	for (const [segment, weight] of Object.entries(weightedSegments)) {
		if (pathname.includes(`/${segment}`) || pathname === `/${segment}`) {
			score += weight;
		}
	}

	return score;
}

async function fetchRemoteText(url: string): Promise<RemotePayload | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(url, {
			headers: {
				accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8",
				"user-agent": USER_AGENT,
			},
			redirect: "follow",
			signal: controller.signal,
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const text = await response.text();
		const contentType = response.headers.get("content-type") ?? "";
		return { text, contentType };
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

function extractTitle(html: string): string | null {
	return (
		firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ??
		firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
	);
}

function extractDescription(html: string): string | null {
	const nameDescription =
		firstMatch(
			html,
			/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i,
		) ??
		firstMatch(
			html,
			/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i,
		);

	if (nameDescription) {
		return nameDescription;
	}

	return (
		firstMatch(
			html,
			/<meta[^>]*property=["']og:description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i,
		) ??
		firstMatch(
			html,
			/<meta[^>]*content=["']([\s\S]*?)["'][^>]*property=["']og:description["'][^>]*>/i,
		)
	);
}

function extractSummary(html: string): string | null {
	const fromMeta = extractDescription(html);
	if (fromMeta) {
		return truncate(fromMeta, 220);
	}

	const text = stripHtml(html);
	if (!text) {
		return null;
	}

	return truncate(text, 220);
}

function getDepthCap(depth: number): number {
	if (depth < 0) {
		return 0;
	}

	return DEPTH_PAGE_CAPS[Math.min(depth, DEPTH_PAGE_CAPS.length - 1)] ?? 0;
}

function sectionBucket(url: URL): string {
	const firstSegment = url.pathname
		.split("/")
		.filter(Boolean)[0]
		?.toLowerCase();
	return firstSegment ?? "__root";
}

function collectPageLinks(
	html: string,
	pageUrl: URL,
	siteOrigin: string,
): string[] {
	const links = new Set<string>();
	const linkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;

	for (const match of html.matchAll(linkPattern)) {
		const href = match[1];
		if (!href || href.startsWith("#")) {
			continue;
		}
		if (
			href.startsWith("mailto:") ||
			href.startsWith("tel:") ||
			href.startsWith("javascript:")
		) {
			continue;
		}

		try {
			const resolved = new URL(href, pageUrl);
			if (resolved.origin !== siteOrigin) {
				continue;
			}
			if (!urlLooksLikeHtmlPage(resolved)) {
				continue;
			}

			links.add(normalizeUrl(resolved));
		} catch {
			continue;
		}
	}

	return [...links];
}

function createPageSummaryFromHtml(pageUrl: URL, html: string): PageSummary {
	const title = extractTitle(html) ?? titleFromUrl(pageUrl);
	const summary =
		extractSummary(html) ?? `Information about ${relativePath(pageUrl)}.`;

	return {
		url: normalizeUrl(pageUrl),
		title: truncate(title, 90),
		summary: truncate(summary, 220),
	};
}

function extractLocUrls(xml: string): string[] {
	const values = new Set<string>();
	const locPattern = /<loc>([\s\S]*?)<\/loc>/gi;
	for (const match of xml.matchAll(locPattern)) {
		const value = cleanWhitespace(decodeHtmlEntities(match[1]));
		if (value) {
			values.add(value);
		}
	}

	return [...values];
}

function parseSitemapHints(robotsText: string): string[] {
	const values = new Set<string>();
	const lines = robotsText.split(/\r?\n/);

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed.toLowerCase().startsWith("sitemap:")) {
			continue;
		}
		const sitemapValue = trimmed.slice("sitemap:".length).trim();
		if (sitemapValue) {
			values.add(sitemapValue);
		}
	}

	return [...values];
}

async function discoverSitemapEntries(baseUrl: URL): Promise<string[]> {
	const sitemapQueue = new Set<string>([
		`${baseUrl.origin}/sitemap.xml`,
		`${baseUrl.origin}/sitemap_index.xml`,
	]);
	const crawledSitemaps = new Set<string>();
	const discoveredPages = new Set<string>();

	const robotsResponse = await fetchRemoteText(
		`${baseUrl.origin}/robots.txt`,
	);
	if (robotsResponse?.text) {
		for (const hintedSitemap of parseSitemapHints(robotsResponse.text)) {
			try {
				const parsed = new URL(hintedSitemap, baseUrl);
				if (parsed.origin === baseUrl.origin) {
					sitemapQueue.add(normalizeUrl(parsed));
				}
			} catch {
				continue;
			}
		}
	}

	const queue = [...sitemapQueue].slice(0, 6);

	while (queue.length > 0 && crawledSitemaps.size < 8) {
		const sitemapUrl = queue.shift();
		if (!sitemapUrl || crawledSitemaps.has(sitemapUrl)) {
			continue;
		}
		crawledSitemaps.add(sitemapUrl);

		const sitemapResponse = await fetchRemoteText(sitemapUrl);
		if (!sitemapResponse?.text) {
			continue;
		}

		for (const loc of extractLocUrls(sitemapResponse.text)) {
			try {
				const parsed = new URL(loc);
				if (parsed.origin !== baseUrl.origin) {
					continue;
				}
				const normalized = normalizeUrl(parsed);
				if (normalized.endsWith(".xml")) {
					if (
						!crawledSitemaps.has(normalized) &&
						!queue.includes(normalized) &&
						queue.length < 10
					) {
						queue.push(normalized);
					}
					continue;
				}
				if (urlLooksLikeHtmlPage(parsed)) {
					discoveredPages.add(normalized);
					if (discoveredPages.size >= MAX_SITEMAP_DISCOVERY) {
						return [...discoveredPages];
					}
				}
			} catch {
				continue;
			}
		}
	}

	return [...discoveredPages];
}

type CrawlQueueEntry = {
	url: string;
	depth: number;
};

async function crawlSiteRecursively(options: {
	baseUrl: URL;
	homeHtml: string;
	seedUrls: string[];
}): Promise<PageSummary[]> {
	const queue: CrawlQueueEntry[] = [];
	const queuedUrls = new Set<string>();
	const visitedUrls = new Set<string>();
	const scheduledDepthCounts = new Map<number, number>();
	const scheduledSectionCounts = new Map<string, number>();
	const pageSummaries: PageSummary[] = [];
	let scheduledTotal = 0;
	const normalizedBaseUrl = normalizeUrl(options.baseUrl);

	const scheduleUrl = (candidateUrl: string, depth: number): boolean => {
		if (depth > MAX_CRAWL_DEPTH) {
			return false;
		}
		if (scheduledTotal >= HARD_CRAWL_PAGE_CAP) {
			return false;
		}

		let parsedUrl: URL;
		try {
			parsedUrl = new URL(candidateUrl);
		} catch {
			return false;
		}

		if (parsedUrl.origin !== options.baseUrl.origin) {
			return false;
		}
		if (!urlLooksLikeHtmlPage(parsedUrl)) {
			return false;
		}

		const normalizedUrl = normalizeUrl(parsedUrl);
		if (visitedUrls.has(normalizedUrl) || queuedUrls.has(normalizedUrl)) {
			return false;
		}

		const scheduledInDepth = scheduledDepthCounts.get(depth) ?? 0;
		if (scheduledInDepth >= getDepthCap(depth)) {
			return false;
		}

		const bucket = sectionBucket(parsedUrl);
		const scheduledInBucket = scheduledSectionCounts.get(bucket) ?? 0;
		if (scheduledInBucket >= MAX_PAGES_PER_SECTION) {
			return false;
		}

		queue.push({ url: normalizedUrl, depth });
		queuedUrls.add(normalizedUrl);
		scheduledTotal += 1;
		scheduledDepthCounts.set(depth, scheduledInDepth + 1);
		scheduledSectionCounts.set(bucket, scheduledInBucket + 1);
		return true;
	};

	scheduleUrl(normalizedBaseUrl, 0);

	const rankedSeedUrls = [...new Set(options.seedUrls)]
		.filter(url => url !== normalizedBaseUrl)
		.sort((a, b) => {
			try {
				const scoreA = scoreCandidateUrl(new URL(a));
				const scoreB = scoreCandidateUrl(new URL(b));
				if (scoreA !== scoreB) {
					return scoreB - scoreA;
				}
			} catch {
				return 1;
			}

			return a.length - b.length;
		});

	for (const seedUrl of rankedSeedUrls) {
		scheduleUrl(seedUrl, 1);
		if (scheduledTotal >= HARD_CRAWL_PAGE_CAP) {
			break;
		}
	}

	while (queue.length > 0 && visitedUrls.size < HARD_CRAWL_PAGE_CAP) {
		const batch = queue.splice(0, CRAWL_CONCURRENCY);

		const results = await Promise.all(
			batch.map(async entry => {
				queuedUrls.delete(entry.url);
				if (visitedUrls.has(entry.url)) {
					return null;
				}

				visitedUrls.add(entry.url);

				const pageUrl = new URL(entry.url);
				const response =
					entry.url === normalizedBaseUrl ?
						{
							text: options.homeHtml,
							contentType: "text/html",
						}
					:	await fetchRemoteText(entry.url);

				if (!response?.text) {
					return null;
				}

				const isHtml = response.contentType
					.toLowerCase()
					.includes("text/html");
				if (!isHtml && response.contentType.length > 0) {
					return null;
				}

				const summary = createPageSummaryFromHtml(
					pageUrl,
					response.text,
				);

				const childLinks =
					entry.depth < MAX_CRAWL_DEPTH ?
						collectPageLinks(
							response.text,
							pageUrl,
							options.baseUrl.origin,
						)
					:	[];

				return {
					depth: entry.depth,
					summary,
					childLinks,
				};
			}),
		);

		for (const result of results) {
			if (!result) {
				continue;
			}

			pageSummaries.push(result.summary);

			const nextDepth = result.depth + 1;
			if (nextDepth > MAX_CRAWL_DEPTH || result.childLinks.length === 0) {
				continue;
			}

			const rankedChildLinks = result.childLinks
				.map(url => {
					try {
						const score = scoreCandidateUrl(new URL(url));
						return { url, score };
					} catch {
						return { url, score: -999 };
					}
				})
				.sort((a, b) => {
					if (a.score !== b.score) {
						return b.score - a.score;
					}
					return a.url.length - b.url.length;
				});

			let scheduledChildren = 0;
			for (const child of rankedChildLinks) {
				if (scheduledChildren >= MAX_CHILD_LINKS_PER_PAGE) {
					break;
				}

				if (scheduleUrl(child.url, nextDepth)) {
					scheduledChildren += 1;
				}

				if (scheduledTotal >= HARD_CRAWL_PAGE_CAP) {
					break;
				}
			}
		}
	}

	return pageSummaries.sort((a, b) => {
		const scoreA = scoreCandidateUrl(new URL(a.url));
		const scoreB = scoreCandidateUrl(new URL(b.url));
		if (scoreA !== scoreB) {
			return scoreB - scoreA;
		}
		return a.url.length - b.url.length;
	});
}

function createLlmsText(options: {
	siteName: string;
	siteSummary: string;
	baseUrl: string;
	pages: PageSummary[];
}) {
	const lines: string[] = [];
	lines.push(`# ${options.siteName}`);
	lines.push("");
	lines.push(`> ${options.siteSummary}`);
	lines.push("");
	lines.push("## Website");
	lines.push(`- Base URL: ${options.baseUrl}`);
	lines.push("");
	lines.push("## Key pages");

	for (const page of options.pages) {
		lines.push(`- [${page.title}](${page.url}): ${page.summary}`);
	}

	return lines.join("\n");
}

export async function POST(request: Request) {
	const clientIp = getClientIp(request);
	const rateLimit = checkRateLimit(clientIp);
	if (!rateLimit.allowed) {
		return NextResponse.json(
			{
				error: `Rate limit exceeded. Try again in about ${rateLimit.retryAfterSeconds} seconds.`,
			},
			{
				status: 429,
				headers: {
					"retry-after": String(rateLimit.retryAfterSeconds),
					"x-ratelimit-limit": String(RATE_LIMIT_MAX_REQUESTS),
					"x-ratelimit-remaining": "0",
				},
			},
		);
	}

	let parsedBody: GenerateRequest;
	try {
		parsedBody = (await request.json()) as GenerateRequest;
	} catch {
		return NextResponse.json(
			{
				error: 'Invalid JSON body. Provide { "url": "https://example.com" }.',
			},
			{ status: 400 },
		);
	}

	const inputUrl = parsedBody.url ?? "";
	const parsedInput = ensureUrl(inputUrl);
	if (!parsedInput) {
		return NextResponse.json(
			{
				error: "Please provide a valid website URL, for example https://example.com",
			},
			{ status: 400 },
		);
	}

	let baseUrl = new URL(normalizeUrl(parsedInput));
	let homeResponse = await fetchRemoteText(baseUrl.toString());
	if (!homeResponse && baseUrl.protocol === "https:") {
		const httpFallback = new URL(baseUrl.toString());
		httpFallback.protocol = "http:";
		const fallbackResponse = await fetchRemoteText(httpFallback.toString());
		if (fallbackResponse) {
			baseUrl = new URL(normalizeUrl(httpFallback));
			homeResponse = fallbackResponse;
		}
	}

	if (!homeResponse?.text) {
		return NextResponse.json(
			{
				error: "Could not fetch the website homepage. Check the URL and try again.",
			},
			{ status: 422 },
		);
	}

	const siteName = extractTitle(homeResponse.text) ?? baseUrl.hostname;
	const siteSummary =
		extractDescription(homeResponse.text) ??
		`Public website for ${baseUrl.hostname}.`;

	const discoveredFromHome = collectPageLinks(
		homeResponse.text,
		baseUrl,
		baseUrl.origin,
	);
	const discoveredFromSitemap = await discoverSitemapEntries(baseUrl);
	const pages = await crawlSiteRecursively({
		baseUrl,
		homeHtml: homeResponse.text,
		seedUrls: [...discoveredFromHome, ...discoveredFromSitemap],
	});

	const fallbackPages: PageSummary[] =
		pages.length > 0 ?
			pages
		:	[
				{
					url: baseUrl.toString(),
					title: siteName,
					summary: siteSummary,
				},
			];

	const llmsText = createLlmsText({
		siteName: truncate(siteName, 90),
		siteSummary: truncate(siteSummary, 220),
		baseUrl: baseUrl.toString(),
		pages: fallbackPages,
	});

	return NextResponse.json({
		llmsText,
		siteName: truncate(siteName, 90),
		siteSummary: truncate(siteSummary, 220),
		pages: fallbackPages,
	});
}
