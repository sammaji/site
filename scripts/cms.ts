import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "md", "blog");
const publicDir = path.join(process.cwd(), "public");

async function getFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : [res];
        })
    );
    return Array.prototype.concat(...files);
}

async function generateCmsJson() {
    const files = await getFiles(contentDir);
    const mdFiles = files.filter(
        (file) => file.endsWith(".md") || file.endsWith(".mdx")
    );

    const posts = await Promise.all(
        mdFiles.map(async (file) => {
            const content = await fs.readFile(file, "utf-8");
            const { data } = matter(content);

            const slug = path.relative(contentDir, file).replace(/\.mdx?$/, "");

            return {
                ...data,
                slug,
            };
        })
    );

    await fs.writeFile(
        path.join(publicDir, "cms.json"),
        JSON.stringify(posts, null, 2)
    );
}

generateCmsJson();