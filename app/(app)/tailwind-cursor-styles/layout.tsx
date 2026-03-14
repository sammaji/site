import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tailwind Cursor Styles Reference",
	description:
		"Searchable reference of Tailwind CSS cursor utilities with live hover previews and one-click copy for utility and CSS values.",
	keywords: [
		"tailwind cursor",
		"tailwind css cursor classes",
		"cursor utilities",
		"css cursor values",
		"tailwind reference",
	],
	alternates: {
		canonical: "https://www.sammaji.com/tailwind-cursor-styles",
	},
	openGraph: {
		title: "Tailwind Cursor Styles Reference",
		description:
			"Complete list of Tailwind cursor utilities with live previews and copy buttons.",
		url: "https://www.sammaji.com/tailwind-cursor-styles",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Tailwind Cursor Styles Reference",
		description:
			"Search and preview every Tailwind cursor utility, then copy the Tailwind or CSS value.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function TailwindCursorStylesLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
