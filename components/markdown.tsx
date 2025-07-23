"use client";

import { cn } from "@/lib/utils";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import React from "react";

export function Markdown({ html, className }: { html: string, className?: string }) {
    React.useEffect(() => {
        hljs.highlightAll();
    }, []);
    return (
        <div className={cn("markdown", className)} dangerouslySetInnerHTML={{ __html: html }} />
    );
}
