import Link from "next/link";

const links = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
];

export function Nav() {
    return (
        <nav>
            <ul className="flex items-center gap-8">
                {links.map(link => (
                    <li key={link.name}>
                        <Link href={link.href}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
