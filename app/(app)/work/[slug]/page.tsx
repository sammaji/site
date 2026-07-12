import { BackButton } from "@/components/back-button";
import { Markdown } from "@/components/markdown";
import { deriveTitleAndDescription, markdown } from "@/lib/markdown";
import { ogImageUrl } from "@/lib/og";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await markdown("work", `${slug}.md`);
	if (typeof data === "number" && data === 404) return notFound();

	const { title, description } = deriveTitleAndDescription(
		data.frontmatter,
		data.content,
	);
	const canonical = `https://www.sammaji.com/work/${slug}`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			title,
			description,
			url: canonical,
			siteName: "Samyabrata Maji",
			type: "article",
			images: [ogImageUrl({ title, description })],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImageUrl({ title, description })],
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const data = await markdown("work", `${slug}.md`);
	if (typeof data === "number" && data === 404) throw notFound();

	return (
		<React.Fragment>
			<BackButton />
			<Markdown html={data.html} />
		</React.Fragment>
	);
}
