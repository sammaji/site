import { Markdown } from "@/components/markdown";
import { markdown } from "@/lib/markdown";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
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
			<Link
				href="/"
				className="hover:text-primary transition-default text-muted-foreground absolute inline-flex -translate-x-full items-center pr-32">
				<ArrowUpLeft /> Home
			</Link>
			<Markdown html={data.html} />
		</React.Fragment>
	);
}
