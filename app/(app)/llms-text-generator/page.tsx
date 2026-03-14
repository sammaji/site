"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

type GeneratedPage = {
	url: string;
	title: string;
	summary: string;
};

type GeneratorResult = {
	llmsText: string;
	siteName: string;
	siteSummary: string;
	pages: GeneratedPage[];
};

export default function LLMSTextGeneratorPage() {
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copyState, setCopyState] = useState<"idle" | "done">("idle");
	const [result, setResult] = useState<GeneratorResult | null>(null);
	const [apiBaseUrl, setApiBaseUrl] = useState("https://www.sammaji.com");
	const copiedTimeout = useRef<number | null>(null);

	const hasOutput = Boolean(result?.llmsText);

	const outputStats = useMemo(() => {
		if (!result?.llmsText) {
			return { lines: 0, chars: 0 };
		}

		return {
			lines: result.llmsText.split("\n").length,
			chars: result.llmsText.length,
		};
	}, [result?.llmsText]);

	const apiEndpoint = `${apiBaseUrl}/api/llms-text-generator`;
	const sampleTargetUrl = websiteUrl.trim() || "https://example.com";

	const apiExamples = useMemo(() => {
		return {
			curl: `curl -X POST "${apiEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"${sampleTargetUrl}"}'`,
			javascript: `const response = await fetch("${apiEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: "${sampleTargetUrl}" }),
});

const data = await response.json();
console.log(data.llmsText);`,
			python: `import requests

response = requests.post(
    "${apiEndpoint}",
    json={"url": "${sampleTargetUrl}"},
    timeout=30,
)

data = response.json()
print(data.get("llmsText"))`,
		};
	}, [apiEndpoint, sampleTargetUrl]);

	useEffect(() => {
		return () => {
			if (copiedTimeout.current !== null) {
				window.clearTimeout(copiedTimeout.current);
			}
		};
	}, []);

	useEffect(() => {
		setApiBaseUrl(window.location.origin);
	}, []);

	const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setCopyState("idle");
		setIsGenerating(true);

		try {
			const response = await fetch("/api/llms-text-generator", {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({ url: websiteUrl.trim() }),
			});

			const payload = (await response.json()) as
				| GeneratorResult
				| { error?: string };

			if (!response.ok) {
				setResult(null);
				setError(
					"error" in payload ?
						(payload.error ??
							"Unable to generate llms.txt for this website.")
					:	"Unable to generate llms.txt for this website.",
				);
				return;
			}

			if (!("llmsText" in payload)) {
				setResult(null);
				setError("Unable to generate llms.txt for this website.");
				return;
			}

			setResult(payload);
		} catch {
			setResult(null);
			setError(
				"Request failed. Please check your connection and try again.",
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const copyOutput = async () => {
		if (!result?.llmsText) {
			return;
		}

		try {
			await navigator.clipboard.writeText(result.llmsText);
		} catch {
			const fallback = document.createElement("textarea");
			fallback.value = result.llmsText;
			document.body.appendChild(fallback);
			fallback.select();
			document.execCommand("copy");
			document.body.removeChild(fallback);
		}

		setCopyState("done");
		if (copiedTimeout.current !== null) {
			window.clearTimeout(copiedTimeout.current);
		}
		copiedTimeout.current = window.setTimeout(() => {
			setCopyState("idle");
		}, 1200);
	};

	const downloadOutput = () => {
		if (!result?.llmsText) {
			return;
		}

		const blob = new Blob([result.llmsText], { type: "text/plain" });
		const fileUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = fileUrl;
		anchor.download = "llms.txt";
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
		URL.revokeObjectURL(fileUrl);
	};

	return (
		<main className="space-y-8">
			<header className="space-y-3">
				<h1 className="text-foreground text-3xl">LLMs.txt Generator</h1>
				<p className="text-muted-foreground">
					Enter a website URL and generate a draft{" "}
					<span className="font-mono">llms.txt</span> file based on
					public site pages.
				</p>
			</header>

			<section className="bg-secondary/10 border-border rounded-lg border px-4">
				<Accordion type="single" collapsible>
					<AccordionItem value="how-generated" className="border-b-0">
						<AccordionTrigger className="text-foreground text-base hover:no-underline">
							How it is generated
						</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-3">
								<p className="text-muted-foreground text-sm">
									This tool reads your existing page metadata
									first:{" "}
									<span className="font-mono">
										&lt;title&gt;
									</span>{" "}
									and{" "}
									<span className="font-mono">
										&lt;meta
										name=&quot;description&quot;&gt;
									</span>
									. It discovers pages from your homepage
									links and sitemap, then drafts{" "}
									<span className="font-mono">llms.txt</span>{" "}
									from those human-written signals.
								</p>
								<p className="text-muted-foreground text-sm">
									Using manual titles and descriptions is
									usually better than AI scraper summaries
									because it preserves your intended wording,
									improves SEO consistency, and forces clear
									metadata authoring on every important page.
								</p>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			<form onSubmit={handleGenerate} className="space-y-3">
				<label
					htmlFor="website-url"
					className="text-muted-foreground text-sm">
					Website URL
				</label>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Input
						id="website-url"
						name="website-url"
						type="url"
						required
						value={websiteUrl}
						onChange={event => setWebsiteUrl(event.target.value)}
						placeholder="https://example.com"
					/>
					<Button type="submit" disabled={isGenerating}>
						{isGenerating ? "Generating..." : "Generate llms.txt"}
					</Button>
				</div>
				{error && <p className="text-destructive text-sm">{error}</p>}
			</form>

			<section className="space-y-3">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 className="text-foreground text-xl">
						Generated Output
					</h2>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={copyOutput}
							disabled={!hasOutput}>
							{copyState === "done" ? "Copied" : "Copy"}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={downloadOutput}
							disabled={!hasOutput}>
							Download
						</Button>
					</div>
				</div>

				<div className="bg-secondary/20 border-border min-h-[280px] rounded-lg border p-4">
					{result?.llmsText ?
						<pre className="text-muted-foreground text-sm whitespace-pre-wrap">
							{result.llmsText}
						</pre>
					:	<p className="text-muted-foreground/80 text-sm">
							Your generated llms.txt content will appear here.
						</p>
					}
				</div>

				<p className="text-muted-foreground/80 text-xs">
					{outputStats.lines} lines • {outputStats.chars} characters
				</p>
			</section>

			{result?.pages?.length ?
				<section className="space-y-3">
					<h2 className="text-foreground text-xl">Detected Pages</h2>
					<div className="space-y-3">
						{result.pages.map(page => (
							<div
								key={page.url}
								className="bg-secondary/10 border-border rounded-md border p-3">
								<p className="text-foreground text-base">
									{page.title}
								</p>
								<p className="text-muted-foreground/80 text-sm">
									{page.url}
								</p>
								<p className="text-muted-foreground mt-2 text-sm">
									{page.summary}
								</p>
							</div>
						))}
					</div>
				</section>
			:	null}

			<section className="space-y-3">
				<h2 className="text-foreground text-xl">API Usage</h2>
				<Tabs defaultValue="curl" className="space-y-3">
					<TabsList className="w-full sm:w-auto">
						<TabsTrigger value="curl">curl</TabsTrigger>
						<TabsTrigger value="javascript">JavaScript</TabsTrigger>
						<TabsTrigger value="python">Python</TabsTrigger>
					</TabsList>

					<TabsContent value="curl">
						<pre className="bg-secondary/20 text-muted-foreground border-border overflow-x-auto rounded-lg border p-4 text-sm whitespace-pre-wrap">
							{apiExamples.curl}
						</pre>
					</TabsContent>

					<TabsContent value="javascript">
						<pre className="bg-secondary/20 text-muted-foreground border-border overflow-x-auto rounded-lg border p-4 text-sm whitespace-pre-wrap">
							{apiExamples.javascript}
						</pre>
					</TabsContent>

					<TabsContent value="python">
						<pre className="bg-secondary/20 text-muted-foreground border-border overflow-x-auto rounded-lg border p-4 text-sm whitespace-pre-wrap">
							{apiExamples.python}
						</pre>
					</TabsContent>
				</Tabs>
			</section>
		</main>
	);
}
