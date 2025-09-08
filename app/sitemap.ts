import { files } from "@/lib/files";
import { payload } from "@/lib/payload";
import axios from "axios";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const work: MetadataRoute.Sitemap = files("work").map(s => ({
		url: `https://www.sammaji.tech/work/${s}`,
		changeFrequency: "monthly",
		lastModified: new Date(),
	}));

	const { data } = await axios.post("https://gql.hashnode.com", {
		query: `
query Publication {
  publication(host: "sammaji.hashnode.dev") {
    posts(first: 50) {
      edges {
        node {
          url
          publishedAt
          updatedAt
        }
      }
    }
  }
}
`,
	});

	const hashnodeBlogs: MetadataRoute.Sitemap =
		data.data.publication.posts.edges.map((e: any) => ({
			url: e.node.url,
			lastModified: new Date(e.node.updatedAt ?? e.node.publishedAt),
			priority: 0.7,
		}));

	const cmsData = await payload.find({
		collection: "blog",
		select: {
			content: {
				title: true,
				description: true,
			},
			seo: {
				seo_title: true,
				seo_description: true,
				slug: true,
			},
			updatedAt: true,
		},
	});

	const cmsBlogs: MetadataRoute.Sitemap = cmsData.docs.map(doc => ({
		url: `https://www.sammaji.tech/blog/${doc.seo.slug}`,
		// @ts-ignore
		lastModified: new Date(doc.updatedAt),
	}));

	return [
		{
			url: "https://sammaji.tech",
			changeFrequency: "monthly",
			lastModified: new Date(),
		},
		{
			url: "https://sammaji.tech/blog",
			changeFrequency: "weekly",
			lastModified: new Date(),
		},
		{
			url: "https://sammaji.tech/work",
			changeFrequency: "weekly",
			lastModified: new Date(),
		},
		...cmsBlogs,
		...hashnodeBlogs,
		...work,
	];
}
