import { Experience } from "@/components/experience";
import { Markdown } from "@/components/markdown";
import { ProjectsExtended } from "@/components/projects";
import { markdown } from "@/lib/markdown";
import React from "react";

export default async function Page() {
    return (
        <React.Fragment>
            <Experience />
            <ProjectsExtended />
        </React.Fragment>
    );
}
