import { Experience } from "@/components/experience";
import { GithubCalendar } from "@/components/github-calendar";
import { links, Links } from "@/components/links";
import { Markdown } from "@/components/markdown";
import { ProjectsCompact } from "@/components/projects";
import { ProjectsMarquee } from "@/components/projects-marquee";
import { markdown } from "@/lib/markdown";
import React from "react";

export default async function Home() {
	const intro = await markdown("home", "intro.md");
	const contact = await markdown("home", "contact.md");
	return (
		<React.Fragment>
			<img
				className="transition-default w-48 -rotate-6 rounded-xl grayscale hover:rotate-0 hover:grayscale-0"
				src="/img/pfp.png"
			/>

			{typeof intro !== "number" && <Markdown html={intro.html} />}

			<ProjectsMarquee />

			<Experience />
			<ProjectsCompact />
			<GithubCalendar />

			<div className="space-y-8">
				<h2 className="text-xl">Contact</h2>
				{typeof contact !== "number" && (
					<Markdown html={contact.html} />
				)}
			</div>

			<Links url={links} />
		</React.Fragment>
	);
}
