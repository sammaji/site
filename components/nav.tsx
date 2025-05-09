"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Work", href: "/work" },
];

export function Nav() {
    const pathname = usePathname();
    return (
        <nav>
            <ul className="flex items-center gap-8">
                {links.map(link => (
                    <li key={link.name} className={cn("transition-default hover:text-primary", pathname === link.href ? "text-primary" : "text-muted-foreground")}>
                        <Link href={link.href}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
