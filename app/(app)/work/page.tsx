import { Experience } from "@/components/experience";
import { GithubCalendar } from "@/components/github-calendar";
import { Markdown } from "@/components/markdown";
import { ProjectsExtended } from "@/components/projects";
import { markdown } from "@/lib/markdown";
import React from "react";

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
