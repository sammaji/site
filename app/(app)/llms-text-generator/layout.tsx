import type { Metadata } from "next";

const canonicalUrl = "https://www.sammaji.com/llms-text-generator";

export const metadata: Metadata = {
	title: "Free LLMs.txt Generator (No Signup)",
	description:
		"Generate a production-ready llms.txt from any website for free. No signup, no account, unlimited usage.",
	keywords: [
		"llms.txt generator",
		"free llms txt generator",
		"llmstxt generator",
		"no signup llms.txt generator",
		"unlimited llms.txt generator",
		"llms txt seo",
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
		title: "Free LLMs.txt Generator (No Signup)",
		description:
			"Generate a production-ready llms.txt from any website for free. No signup, no account, unlimited usage.",
		url: canonicalUrl,
		siteName: "sammaji.com",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free LLMs.txt Generator (No Signup, Unlimited)",
		description:
			"Generate a production-ready llms.txt from any website for free. No signup, no account, unlimited usage.",
	},
};

const structuredData = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebApplication",
			name: "Free LLMs.txt Generator",
			url: canonicalUrl,
			applicationCategory: "DeveloperApplication",
			operatingSystem: "Web",
			description:
				"Generate a production-ready llms.txt from any website for free. No signup, no account, unlimited usage.",
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
			featureList: [
				"Free llms.txt generation",
				"No signup required",
				"Unlimited usage",
				"Recursive crawl with depth and breadth limits",
			],
		},
		{
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: "Is this llms.txt generator free?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes. It is free to use.",
					},
				},
				{
					"@type": "Question",
					name: "Do I need to sign up?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "No signup or account is required.",
					},
				},
				{
					"@type": "Question",
					name: "Is usage unlimited?",
					acceptedAnswer: {
						"@type": "Answer",
						text: "Yes, usage is unlimited.",
					},
				},
			],
		},
	],
};

export default function LLMSTextGeneratorLayout({
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
