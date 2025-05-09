import { Markdown } from "@/components/markdown";
import { ProjectsExtended } from "@/components/projects";
import { markdown } from "@/lib/markdown";
import React from "react";

export default async function Page() {
    const work = await markdown("home", "work.md");
    return (
        <React.Fragment>
            <div className="space-y-8">
                <h1 className="font-medium">Work</h1>
                {typeof work !== "number" && <Markdown html={work.html} />}
            </div>

            <ProjectsExtended />
        </React.Fragment>
    )
}
