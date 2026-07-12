import { experience } from "@/components/experience";
import { compactProjects, projects } from "@/components/projects";
import { deriveTitleAndDescription } from "@/lib/markdown";
import cms from "@/public/cms.json";
import { format } from "date-fns";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";

export const dynamic = "force-dynamic";

const site = "https://www.sammaji.com";

function markdownResponse(body: string) {
	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
}

function absoluteUrl(url: string) {
	return url.startsWith("/") ? `${site}${url}` : url;
}

function experienceMarkdown() {
	const lines = experience.map(
		e =>
			`- **${e.role} — ${e.company}** (${e.date}): ${absoluteUrl(e.link)}`,
	);
	return `## Experience\n\n${lines.join("\n")}\n`;
}

function projectsMarkdown() {
	const byUrl = new Map<string, { name: string; description: string; url: string }>();

	for (const p of [...projects, ...compactProjects]) {
		if (typeof p.description !== "string") continue;
		const existing = byUrl.get(p.url);
		if (!existing || p.description.length > existing.description.length) {
			byUrl.set(p.url, {
				name: p.name,
				description: p.description,
				url: p.url,
			});
		}
	}

	const lines = Array.from(byUrl.values()).map(
		p => `- **${p.name}** — ${p.description}: ${absoluteUrl(p.url)}`,
	);
	return `## Projects\n\n${lines.join("\n")}\n`;
}

function blogListMarkdown() {
	const posts = cms
		.slice()
		.sort(
			(a, b) =>
				new Date(b.published_at).getTime() -
				new Date(a.published_at).getTime(),
		);

	const lines = posts.map(
		post =>
			`- [${post.title}](${site}/blog/${post.slug}) — ${format(new Date(post.published_at), "yyyy-MM-dd")}`,
	);

	return `# Blog\n\n${lines.join("\n")}\n`;
}

async function blogPostMarkdown(slug: string) {
	const post = cms.find(p => p.slug === slug);
	if (!post || !post.file) return null;

	const filePath = path.join(process.cwd(), "md", "blog", post.file);
	let raw: string;
	try {
		raw = await fs.readFile(filePath, "utf-8");
	} catch {
		return null;
	}

	const { data, content } = matter(raw);
	const title = (data?.title as string | undefined) ?? post.title;

	return `# ${title} (${site}/blog/${slug})\n\n${content.trim()}\n`;
}

async function workPagesMarkdown() {
	const dir = path.join(process.cwd(), "md", "work");
	const files = (await fs.readdir(dir)).filter(
		file => file.endsWith(".md") && !file.startsWith("_"),
	);

	const entries = await Promise.all(
		files.map(async file => {
			const raw = await fs.readFile(path.join(dir, file), "utf-8");
			const { data, content } = matter(raw);
			const { title } = deriveTitleAndDescription(data, content);
			const slug = file.replace(/\.md$/, "");
			return `- [${title}](${site}/work/${slug})`;
		}),
	);

	return `## All work pages\n\n${entries.join("\n")}\n`;
}

async function workListMarkdown() {
	const sections = [
		experienceMarkdown(),
		projectsMarkdown(),
		await workPagesMarkdown(),
	];

	return `# Work\n\n${sections.join("\n")}`;
}

async function workPostMarkdown(slug: string) {
	const filePath = path.join(process.cwd(), "md", "work", `${slug}.md`);
	let raw: string;
	try {
		raw = await fs.readFile(filePath, "utf-8");
	} catch {
		return null;
	}

	const { content } = matter(raw);

	return `${content.trim()}\n\nSource: ${site}/work/${slug}\n`;
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params;
	const [section, id] = slug;

	if (section === "blog" && !id) {
		return markdownResponse(blogListMarkdown());
	}

	if (section === "blog" && id) {
		const body = await blogPostMarkdown(id);
		if (!body) notFound();
		return markdownResponse(body);
	}

	if (section === "work" && !id) {
		return markdownResponse(await workListMarkdown());
	}

	if (section === "work" && id) {
		const body = await workPostMarkdown(id);
		if (!body) notFound();
		return markdownResponse(body);
	}

	notFound();
}
