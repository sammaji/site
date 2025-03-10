import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";


type Project = {
    name: string;
    description: string;
    url: string;
    image?: string;
}

const projects: Project[] = [
    {
        name: "samscript",
        description: "scripting language i wrote to see how interpreters work",
        url: "https://github.com/sammaji/samscript-ts",
        image: "https://www.sammaji.tech/_next/image?url=%2Fimages%2Fsamscript.webp&w=1920&q=100",
    },
    {
        name: "hono-server-cache",
        description: "A flexible server-side caching middleware for Hono applications.",
        url: "https://github.com/sammaji/hono-server-cache",
        image: "/img/hono-server-cache.png",
    },
    {
        name: "dns-server",
        description: "simple toy dns resolver",
        url: "https://github.com/sammaji/toy-dns-server",
        image: "https://www.sammaji.tech/_next/image?url=%2Fimages%2Fdns-server.webp&w=1920&q=100",
    },
];

export function Projects() {
    return (
        <div className="flex flex-col gap-8">
            <span className="font-medium">Projects</span>

            <ScrollArea>
                <div className="flex w-max gap-4 pb-4">
                    {projects.map((project, i) => (
                        <Link key={i} href={project.url}>
                            <div key={i} className="max-w-72 rounded-lg border">
                                <img className="rounded-t-lg" src={project.image} />
                                <div className="rounded-b-lg bg-[#0D0D0C] p-4">
                                    <span>{project.name}</span>
                                    <p className="line-clamp-3 text-base font-medium text-ellipsis">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
