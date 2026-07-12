import { ogImageUrl } from "@/lib/og";
import type { Metadata } from "next";

const title = "Tailwind Cursor Styles Reference";
const description =
	"Searchable reference of Tailwind CSS cursor utilities with live hover previews and one-click copy for utility and CSS values.";

export const metadata: Metadata = {
	title,
	description,
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
		title,
		description,
		url: "https://www.sammaji.com/tailwind-cursor-styles",
		siteName: "Samyabrata Maji",
		type: "website",
		images: [ogImageUrl({ title, description })],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [ogImageUrl({ title, description })],
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
