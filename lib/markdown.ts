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
		html: html.toString(),
	};
}
