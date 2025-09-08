import { Experience } from "@/components/experience";
import { ProjectsExtended } from "@/components/projects";
import React from "react";

export default async function Page() {
	return (
		<React.Fragment>
			<Experience />
			<ProjectsExtended />
		</React.Fragment>
	);
}
