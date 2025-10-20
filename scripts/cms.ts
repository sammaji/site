import axios from "axios";
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

type HashnodePosts = {
	data: {
		publication: {
			posts: {
				edges: {
					node: {
						title: string;
						url: string;
						slug: string;
						publishedAt: string;
						updatedAt: string;
						tags: {
							name: string;
						}[];
					};
				}[];
			};
		};
	};
};

async function getHashnodePosts() {
	const { data } = await axios.post<HashnodePosts>(
		"https://gql.hashnode.com",
		{
			query: `
                query Publication {
                  publication(host: "sammaji.hashnode.dev") {
                    posts(first: 50) {
                      edges {
                        node {
                          title
                          url
                          slug
                          publishedAt
                          updatedAt
                          tags {
                            name
                          }
                        }
                      }
                    }
                  }
                }
            `,
		},
	);
	const hashnodeposts = data.data.publication.posts.edges.map(x => ({
		title: x.node.title,
		slug: x.node.slug,
		published_at: new Date(x.node.publishedAt),
		updated_at: new Date(x.node.updatedAt),
		tags: x.node.tags.map(t => t.name),
		source: "hashnode",
	}));
	console.log(`Fetched ${hashnodeposts.length} posts from hashnode.`);
	return hashnodeposts;
}

async function generateCmsJson() {
	const localposts = await getLocalPosts(contentDir);
	const hashnodeposts = await getHashnodePosts();
	const posts = [...localposts, ...hashnodeposts].sort(
		(a, b) => b.published_at.getTime() - a.published_at.getTime(),
	);

	await fsPromise.writeFile(
		path.join(publicDir, "cms.json"),
		JSON.stringify(posts, null, 2),
	);
}

generateCmsJson();
