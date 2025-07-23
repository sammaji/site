import Link from "next/link"
import React from "react"

const experience = [
    {
        company: "Careshift",
        logo: "/img/careshift.png",
        role: "Full-stack, Contract",
        date: "June 2025 - Present",
        description: "Developed a scheduling system for medical caregivers, monitoring, incetives management and two way sync across multiple CRMs",
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
        link: "/work/venus-remedies-gasar-project",
    },
    {
        company: "BairesDev",
        logo: "/img/bairesdev.png",
        role: "Technical Writer",
        date: "June 2023 - Mar 2024",
        link: "/work/bairesdev",
    }
]

export function Experience() {
    return (
        <div className="space-y-8">
            <h2 className="text-xl">Experience</h2>
            <div className="space-y-4">
                {
                    experience.map((e, i) => (
                        <React.Fragment key={i}>
                            <Link href={e.link} className="flex gap-4 items-center hover:brightness-150 transition-default">
                                <img src={e.logo} className="size-8 rounded aspect-square bg-slate-800" />
                                <p className="grow">{e.role} — <span className="text-primary">{e.company}</span></p>
                                <p>{e.date}</p>
                            </Link>
                            <hr />
                        </React.Fragment>
                    ))
                }
                <Link href={"/work/others"} className="flex gap-4 items-center hover:brightness-150 transition-default">
                    <p className="ml-auto">→ View More</p>
                </Link>
                <hr />
            </div>
        </div>
    )
}
