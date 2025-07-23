import { Markdown } from "@/components/markdown";
import { markdown } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ArrowUpLeft, MoveUpLeft } from "lucide-react";

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
            <Link href="/" className="absolute hover:text-primary transition-default inline-flex items-center -translate-x-full pr-32 text-muted-foreground"><ArrowUpLeft /> Home</Link>
            <Markdown html={data.html} />
        </React.Fragment>
    );
}
