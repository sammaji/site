import Link from "next/link";
import React from "react";

const experience = [
    {
        company: "Maxim AI",
        logo: "/img/maxim_ai.jpeg",
        role: "SDE-I, Full-time",
        date: "Nov 2025 - Present",
        description:
            "Developed a scheduling system for medical caregivers, monitoring, incetives management and two way sync across multiple CRMs",
        link: "https://www.getmaxim.ai/?ref=sammaji.com",
    },
    {
        company: "Careshift",
        logo: "/img/careshift.png",
        role: "Full-stack, Contract",
        date: "June 2025 - Nov 2025",
        description:
            "Developed a scheduling system for medical caregivers, monitoring, incetives management and two way sync across multiple CRMs",
        link: "/work/careshift",
    },
    {
        company: "artvy.ai",
        logo: "/img/artvy.webp",
        role: "Full-stack, Contract",
        date: "Jan 2025 - Mar 2025",
        link: "/work/artvy",
    },
    {
        company: "Suppalyze",
        logo: "/img/suppalyze.png",
        role: "Full-stack, Contract",
        date: "Dec 2024 - Feb 2025",
        link: "/work/suppalyze",
    },
    {
        company: "Venus Remedies",
        logo: "/img/venus-remedies.png",
        role: "Software engineer intern",
        date: "Jan 2024 - April 2025",
        link: "https://venusremedies.com",
    },
    {
        company: "BairesDev",
        logo: "/img/bairesdev.png",
        role: "Technical Writer",
        date: "June 2023 - Mar 2024",
        link: "/work/bairesdev",
    },
];

export function Experience() {
    return (
        <div className="space-y-8">
            <h2 className="text-xl">Experience</h2>
            <div className="space-y-4">
                {experience.map((e, i) => (
                    <React.Fragment key={i}>
                        <Link
                            href={e.link}
                            className="transition-default flex items-center gap-4 hover:brightness-150">
                            <img
                                src={e.logo}
                                className="aspect-square size-8 rounded bg-slate-800 max-md:size-6"
                            />
                            <p className="grow max-md:text-sm">
                                {e.role} —{" "}
                                <span className="text-primary">
                                    {e.company}{" "}
                                    {e.company !== "Venus Remedies" && <span className="md:hidden">
                                        (Read more)
                                    </span>}
                                </span>
                            </p>
                            <p className="max-md:text-sm">{e.date}</p>
                        </Link>
                        <hr />
                    </React.Fragment>
                ))}
                <Link
                    href={"/work/others"}
                    className="transition-default flex items-center gap-4 hover:brightness-150">
                    <p className="ml-auto max-md:text-sm">→ View More</p>
                </Link>
                <hr />
            </div>
        </div>
    );
}
