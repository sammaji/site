"use client";

import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import React from "react";

export function Markdown({ html }: { html: string }) {
	React.useEffect(() => {
		hljs.highlightAll();
	}, []);
	return (
		<div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
	);
}
