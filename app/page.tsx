import { links, Links, socials } from "@/components/links";
import { Markdown } from "@/components/markdown";
import { Nav } from "@/components/nav";
import { ProjectsCompact } from "@/components/projects";
import { markdown } from "@/lib/markdown";
import React from "react";

export default async function Home() {
    const intro = await markdown("home", "intro.md");
    const contact = await markdown("home", "contact.md");
    return (
        <React.Fragment>

            <img className="transition-default rounded-xl -rotate-6 grayscale hover:rotate-0 hover:grayscale-0" src="https://avatars.githubusercontent.com/u/116789799?s=200&u=67949327fda8146222882ecd001e9ba59f87e848&v=4" />
            {typeof intro !== "number" && <Markdown html={intro.html} />}

            <ProjectsCompact />

            <div className="space-y-8">
                <h1 className="font-medium">Contact</h1>
                {typeof contact !== "number" && <Markdown html={contact.html} />}
            </div>


            {/*
            <div className="space-y-8">
                <p><span className="font-medium">Newsletter</span></p>
                <p>Receive occasional updates, tips, guides, etc.</p>
                <input className="border hover:outline" placeholder="Enter your email" />

                <form className="mt-6 flex h-10 items-center  justify-between gap-2 overflow-hidden rounded-md bg-gray-100 bg-white shadow-border focus-within:border-gray-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-black/20 focus-within:ring-offset-0 dark:bg-[#0B0B09] dark:focus-within:ring-white/20 border-gray-200 focus-within:border-gray-400 focus-within:ring-black/20 dark:focus-within:ring-white/20">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input id="email" className="h-full w-[40%] grow border-none bg-transparent px-3.5 transition-colors placeholder:text-gray-900 focus:outline-none" placeholder="Enter your email" value="" />

                    <button type="submit" className="hover:bg-gray-1200/90 mr-1 h-[30px] w-[80px] rounded-[4px] bg-gray-1200 px-1.5 text-sm font-medium text-gray-100 outline-none focus:shadow-focus-ring md:w-[104px] md:px-3.5">
                        <span className="block">Subscribe</span>
                    </button>
                </form>
            </div>
            */}


            <Links url={links} />
        </React.Fragment>
    );
}
