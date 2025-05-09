import { files } from "@/lib/files";
import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const work: MetadataRoute.Sitemap = files("work").map(s => ({
		url: `http://sammaji.tech/work/${s}`,
		changeFrequency: "monthly",
		lastModified: new Date(),
		priority: 0.5,
	}));

	const query = `
query Publication {
  publication(host: "sammaji.hashnode.dev") {
    posts(first: 50) {
      edges {
        node {
          url
          updatedAt
        }
      }
    }
  }
}
`;

	const { data } = await axios.post("https://gql.hashnode.com", {
		query,
	});

	const blogs: MetadataRoute.Sitemap = data.data.publication.posts.edges.map(
		(e: any) => ({
			url: e.node.url.replace("blog.sammaji.tech", "sammaji.tech/blog"),
			changeFrequency: "monthly",
			lastModified: new Date(e.node.updatedAt),
			priority: 0.7,
		}),
	);

	return [
		{
			url: "https://sammaji.tech",
			changeFrequency: "monthly",
			lastModified: new Date(),
			priority: 0.9,
		},
		{
			url: "https://sammaji.tech/blog",
			changeFrequency: "weekly",
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: "https://sammaji.tech/work",
			changeFrequency: "weekly",
			lastModified: new Date(),
			priority: 1,
		},
		...blogs,
		...work,
	];
}
