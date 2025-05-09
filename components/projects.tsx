import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import React from "react";
import { cn } from "@/lib/utils";
import { gradients } from "./gradients";
import { hashString } from "@/lib/hash";


type Project = {
    name: string;
    description: string;
    url: string;
    image?: string;
}

const projects: Project[] = [
    {
        name: "budgetbee",
        description: "Simple expense tracker :)",
        url: "https://www.budgetbee.site",
        image: "/img/budgetbee.webp",
    },
    {
        name: "samscript",
        description: "Scripting language I wrote to see how interpreters work.",
        url: "https://github.com/sammaji/samscript-ts",
        image: "/img/samscript.webp",
    },
    {
        name: "hono-server-cache",
        description: "A flexible server-side caching middleware for Hono applications.",
        url: "https://github.com/sammaji/hono-server-cache",
        image: "/img/hono-server-cache.webp",
    },
    {
        name: "typer",
        description: "A tool to help you learn touch typing.",
        url: "https://github.com/sammaji/typer",
        image: "/img/typer.webp",
    },
    {
        name: "dns-server",
        description: "Simple toy dns resolver.",
        url: "https://github.com/sammaji/toy-dns-server",
        image: "/img/dns-server.webp",
    },
    {
        name: "chess",
        description: "Chess game written in C.",
        url: "https://github.com/sammaji/chess",
    },
    {
        name: "html-parser",
        description: "Html parser designed to be fast not exhaustive. Designed to be extended for custom parsing needs.",
        url: "https://github.com/sammaji/fast-html-parser",
    },
    {
        name: "Mindmaply",
        description: "Mindmap builder",
        url: "https://mindmap-builder.vercel.app",
        image: "/img/mindmaply.png",
    },
    {
        name: "tinytui",
        description: "Create declarative tui",
        url: "https://github.com/sammaji/tinytui"
    },
];

export function Project({ project }: { project: Project }) {
    return (
        <Link href={project.url}>
            <div className="max-w-72 rounded-lg border">
                {project.image && <img className="rounded-t-lg" src={project.image} />}
                {
                    !project.image && <div className="relative w-72 h-36 rounded-t-lg">
                        <span
                            className={cn(
                                gradients[hashString(project.name, gradients.length)],
                                "opacity-50 absolute inset-0 rounded-t-lg"
                            )}
                        ></span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-4xl">{project.name}</h1>
                        </div>
                    </div>
                }
                <div className="rounded-b-lg bg-[#0D0D0C] p-4">
                    <span>{project.name}</span>
                    <p className="line-clamp-3 text-base text-ellipsis">
                        {project.description}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export function ProjectsCompact() {
    const PROJECTS = 4;
    return (
        <div className="flex flex-col gap-8">

            <div className="flex justify-between">
                <h1 className="font-medium">Work</h1>
                <Link href="/work">See all</Link>
            </div>

            <ScrollArea>
                <div className="flex w-max gap-4 pb-4">
                    {projects.slice(0, PROJECTS).map((project, i) => (
                        <React.Fragment key={i}>
                            <Project project={project} />
                        </React.Fragment>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

export function ProjectsExtended() {
    return (
        <div className="space-y-8">
            <h1 className="font-medium">Projects</h1>

            <div className="flex flex-wrap gap-4 pb-4">
                {projects.map((project, i) => (
                    <React.Fragment key={i}>
                        <Project project={project} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
