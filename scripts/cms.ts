import fs from "fs";
import fsPromise from "fs/promises";
import matter from "gray-matter";
import path from "path";

const contentDir = path.join(process.cwd(), "md", "blog");
const publicDir = path.join(process.cwd(), "public");

async function getLocalPosts(dir: string) {
	if (!fs.existsSync(dir)) {
		return [];
	}

	const dirents = await fsPromise.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map(dirent => {
			const res = path.resolve(dir, dirent.name);
			return dirent.isDirectory() ? getLocalPosts(res) : [res];
		}),
	);
	const localfiles: string[] = Array.prototype.concat(...files);
	const mdfiles = localfiles.filter(
		f => f.endsWith(".md") || f.endsWith(".mdx"),
	);

	const localposts = await Promise.all(
		mdfiles.map(async file => {
			const content = await fsPromise.readFile(file, "utf-8");
			const { data } = matter(content);

			if (!data.published_at) {
				throw new Error(`No published_at found in ${file}.`);
			}

			const slug = path.relative(contentDir, file).replace(/\.mdx?$/, "");
			const metadata = {
				...data,
				slug,
				published_at: new Date(data.published_at),
				file: file.replace(contentDir, ""),
				source: "local",
			};
			console.log(`cms(${metadata.slug}): `, metadata.file);
			return metadata;
		}),
	);

	return localposts;
}

async function generateCmsJson() {
	const posts = (await getLocalPosts(contentDir)).sort(
		(a, b) => b.published_at.getTime() - a.published_at.getTime(),
	);

	await fsPromise.writeFile(
		path.join(publicDir, "cms.json"),
		JSON.stringify(posts, null, 2),
	);
}

generateCmsJson();
