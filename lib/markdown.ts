import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";

export async function markdown(...paths: string[]) {
	const fullPath = path.join(process.cwd(), "md", ...paths);

	if (!fs.existsSync(fullPath)) return 404;

	const fileContents = fs.readFileSync(fullPath, "utf8");

	const { data, content } = matter(fileContents);
	const html = await remark().use(remarkHtml).process(content);

	return {
		frontmatter: data,
		content,
		html: html.toString(),
	};
}

function stripMarkdown(line: string) {
	return line
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[#*_`>]/g, "")
		.trim();
}

export function deriveTitleAndDescription(
	frontmatter: Record<string, unknown>,
	content: string,
) {
	const lines = content
		.split("\n")
		.map(line => line.trim())
		.filter(Boolean);

	const headingLine = lines.find(line => line.startsWith("#"));
	const title =
		(frontmatter.title as string | undefined) ||
		(headingLine ? stripMarkdown(headingLine) : "");

	const paragraphLine = lines.find(
		line => line !== headingLine && !line.startsWith("#"),
	);
	const description =
		(frontmatter.description as string | undefined) ||
		(paragraphLine ? stripMarkdown(paragraphLine).slice(0, 160) : "");

	return { title, description };
}
