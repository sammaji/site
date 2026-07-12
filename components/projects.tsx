import { hashString } from "@/lib/hash";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { gradients } from "./gradients";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export type Project = {
	name: string;
	description: string | React.ReactNode;
	url: string;
	image?: string;
};

export const projects: Project[] = [
	{
		name: "atomo",
		description:
			"a fast file manager with loads of useful features - fuzzy search, multi-pane, reliable copy, etc.",
		url: "/work/atomo",
		image: "/img/atomo.webp",
	},
	{
		name: "budgetbee",
		description:
			"simple expense tracker - local sync, currency conversion, self hosted (i use it btw).",
		url: "https://github.com/sammaji/budgetbee",
		image: "/img/budgetbee.webp",
	},
	{
		name: "dns-server",
		description: "Simple toy dns resolver.",
		url: "https://github.com/sammaji/toy-dns-server",
		image: "/img/dns-server.webp",
	},
	{
		name: "typer",
		description: "a tool to help you learn touch typing.",
		url: "https://github.com/sammaji/typer",
		image: "/img/typer.webp",
	},
];

export const compactProjects: Omit<Project, "image">[] = [
	// {
	// 	name: "mox",
	// 	description:
	// 		"local first sync library (~20kb), posgtres WAL sync, outbox, shapes partial sync, sql query builder, adapter for express, hono, gin, fasthttp, tokio, etc.",
	// 	url: "https://github.com/sammaji/mox",
	// },
	{
		name: "atomo",
		description: "plugin based file manager.",
		url: "/work/atomo",
	},
	{
		name: "budgetbee",
		description:
			"expense, subscription tracker, local sync, multi-currency, self hostable",
		url: "https://www.budget-bee.app",
	},
	{
		name: "hono-server-cache",
		description:
			"flexible server-side caching middleware for hono-js applications.",
		url: "https://github.com/sammaji/hono-server-cache",
	},
	// {
	// 	name: "tinytui",
	// 	description:
	// 		"declarative event driven composable zero-dependency tui library in libc based on elm architure.",
	// 	url: "https://github.com/sammaji/tinytui",
	// },
	// {
	// 	name: "kargs",
	// 	description: (
	// 		<>
	// 			cli arg parser that lets you define your own rules - parse case
	// 			sensitive or insensitive, order dependent or agnostic, type
	// 			checks or absurd stuff like <code>clang -ccc</code>.
	// 		</>
	// 	),
	// 	url: "https://github.com/sammaji/kargs",
	// },
	{
		name: "samscript",
		description:
			"scripting language i wrote to learn how interpreters work.",
		url: "https://github.com/sammaji/samscript-ts",
	},
	{
		name: "gh-cdn",
		description:
			"command-line tool that managing static assets, saves to a gitHub repositories. I use GitHub as a mini cdn for my personal blog.",
		url: "https://www.npmjs.com/package/gh-cdn",
	},
	{
		name: "next-quickstart",
		description:
			"very very opionated nextjs setup - auth, billing, emails, postgres, no orms, some pre built ui and some utilities.",
		url: "https://github.com/sammaji/next-quickstart",
	},
	{
		name: "browser-react-preview",
		description:
			"react mini playground with component inspector that does not require server side compilation",
		url: "/blog/browser-react-preview",
	},
	// {
	// 	name: "term-ai",
	// 	description: "a web based terminal emulator with AI",
	// 	url: "https://github.com/sammaji/term-ai",
	// },
];

export function Project({ project }: { project: Project }) {
	return (
		<Link href={project.url}>
			<div className="max-w-72 rounded-lg border">
				{project.image && (
					<img className="rounded-t-lg" src={project.image} />
				)}
				{!project.image && (
					<div className="relative h-36 w-72 rounded-t-lg">
						<span
							className={cn(
								gradients[
									hashString(project.name, gradients.length)
								],
								"absolute inset-0 rounded-t-lg opacity-50",
							)}></span>
						<div className="absolute inset-0 flex items-center justify-center">
							<h1 className="text-4xl">{project.name}</h1>
						</div>
					</div>
				)}
				<div className="rounded-b-lg bg-[#0D0D0C] p-4">
					<span>{project.name}</span>
					<p className="line-clamp-3 text-base text-ellipsis">
						{project.description}
					</p>
				</div>
			</div>
		</Link>
	);
}

export function ProjectsCompact() {
	const PROJECTS = 3;
	return (
		<div className="flex flex-col gap-8">
			<div className="flex justify-between">
				<h2 className="text-xl">Projects</h2>
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
			<h2 className="scroll-m-16 text-xl" id="projects">
				Projects
			</h2>

			<div className="space-y-4 pb-4">
				{compactProjects.map((p, i) => (
					<React.Fragment key={i}>
						<div className="grid grid-cols-[1fr_2fr] gap-2">
							<a href={p.url}>{p.name}</a>
							<p>{p.description}</p>
						</div>
					</React.Fragment>
				))}
			</div>

			<div className="flex flex-wrap gap-4 pb-4">
				{projects.map((project, i) => (
					<React.Fragment key={i}>
						<Project project={project} />
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export function ProjectList() {
	return (
		<div className="space-y-8">
			<h2 className="text-xl">Projects</h2>

			<div className="flex flex-wrap gap-4 pb-4">
				{projects.map((project, i) => (
					<React.Fragment key={i}>
						<p>{project.name}</p>
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
