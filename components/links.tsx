import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const links = {
    title: "Links",
    links: [
        { name: "X", href: "https://x.com/sammaji15" },
        { name: "Notes", href: "https://notes.sammaji.tech" },
        {
            name: "Reading list",
            href: "https://sammaji.notion.site/reading-list-2025",
        },
        {
            name: "Coding setup",
            href: "/work/coding-setup",
        }
    ],
};

export const socials = {
    title: "Socials",
    links: [
        { name: "Twitter", href: "https://x.com/sammaji15" },
        { name: "GitHub", href: "https://github.com/sammaji" },
    ],
};

export function Links({ url }: { url: typeof links }) {
    return (
        <div className="space-y-8">
            <h1 className="font-medium">{url.title}</h1>

            <ul className="space-y-4">
                {url.links.map((link, i) => (
                    <li key={i}>
                        <Link
                            href={link.href}
                            className="inline-flex items-center gap-4">
                            {link.name}{" "}
                            <ArrowUpRight className="size-6" strokeWidth={1} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
