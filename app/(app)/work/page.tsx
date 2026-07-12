import { Experience } from "@/components/experience";
import { GithubCalendar } from "@/components/github-calendar";
import { Markdown } from "@/components/markdown";
import { ProjectsExtended } from "@/components/projects";
import { markdown } from "@/lib/markdown";
import { ogImageUrl } from "@/lib/og";
import type { Metadata } from "next";
import React from "react";

const title = "Work";
const description =
	"Projects and experience — things I've built and worked on — saas products, internal tools, and open-source projects.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "https://www.sammaji.com/work" },
	openGraph: {
		title,
		description,
		url: "https://www.sammaji.com/work",
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

export default async function Page() {
	const contact = await markdown("home", "contact.md");
	return (
		<React.Fragment>
			<Experience />
			<ProjectsExtended />
			<GithubCalendar />
			<div className="space-y-8">
				<h2 className="text-xl">Contact</h2>
				{typeof contact !== "number" && (
					<Markdown html={contact.html} />
				)}
			</div>
		</React.Fragment>
	);
}
