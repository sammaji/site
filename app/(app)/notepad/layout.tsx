import { ogImageUrl } from "@/lib/og";
import type { Metadata } from "next";

const canonicalUrl = "https://www.sammaji.com/notepad";
const title = "Notepad";
const description = "A minimal online notepad.";

export const metadata: Metadata = {
	title,
	description,
	keywords: [
		"online notepad",
		"free notepad",
		"notepad no signup",
		"browser notes app",
		"local storage notes",
		"simple text editor online",
	],
	alternates: {
		canonical: canonicalUrl,
	},
	robots: {
		index: true,
		follow: true,
		"max-snippet": -1,
		"max-image-preview": "large",
		"max-video-preview": -1,
	},
	openGraph: {
		title,
		description,
		url: canonicalUrl,
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
};

const structuredData = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "Notepad",
	url: canonicalUrl,
	applicationCategory: "ProductivityApplication",
	operatingSystem: "Web",
	description,
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
	featureList: [
		"Create and manage multiple notes",
		"Search across notes",
		"Saved automatically to browser local storage",
		"No signup required",
	],
};

export default function NotepadLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>
		</>
	);
}
