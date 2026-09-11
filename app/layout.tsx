import "@/app/globals.css";
import { SiteLayout } from "@/components/site-layout";
import { ogImageUrl } from "@/lib/og";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const title = "Samyabrata Maji — Full-Stack Software Engineer";
const description =
	"Full-stack software engineer based in India. Writing about Next.js, Go, distributed systems, and web development.";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.sammaji.com"),
	title: {
		default: title,
		template: "%s | Samyabrata Maji",
	},
	description,
	keywords: [
		"Samyabrata Maji",
		"full-stack engineer",
		"software engineer India",
		"Next.js developer",
		"Go developer",
		"Maxim AI",
		"freelance web developer",
	],
	authors: [{ name: "Samyabrata Maji", url: "https://www.sammaji.com" }],
	creator: "Samyabrata Maji",
	publisher: "Samyabrata Maji",
	alternates: {
		canonical: "https://www.sammaji.com",
	},
	openGraph: {
		title,
		description,
		url: "https://www.sammaji.com",
		siteName: "Samyabrata Maji",
		images: [ogImageUrl({ title, description })],
		type: "website",
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
		"max-snippet": -1,
		"max-image-preview": "large",
	},
};

const structuredData = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Samyabrata Maji",
	url: "https://www.sammaji.com",
	jobTitle: "Software Engineer",
	description,
	worksFor: {
		"@type": "Organization",
		name: "Maxim AI",
		url: "https://www.getmaxim.ai",
	},
	sameAs: [
		"https://github.com/sammaji",
		"https://x.com/sammaji15",
		"https://peerlist.io/sammaji15",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${geistMono.variable} dark antialiased`}>
				<SiteLayout>{children}</SiteLayout>
				<Analytics />
				<SpeedInsights />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
			</body>
		</html>
	);
}
