import { BackButton } from "@/components/back-button";
import { Markdown } from "@/components/markdown";
import { markdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import React from "react";

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
