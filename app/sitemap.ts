import { files } from "@/lib/files";
import cmsJson from "@/public/cms.json";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const work: MetadataRoute.Sitemap = files("work").map(s => ({
		url: `https://www.sammaji.com/work/${s}`,
		changeFrequency: "monthly",
	}));

	const blog: MetadataRoute.Sitemap = cmsJson.map(s => {
		// @ts-ignore
		const lastMod = s?.last_edited_at ? s.last_edited_at : s.published_at;
		return {
			url: `https://www.sammaji.com/blog/${s.slug}`,
			lastModified: new Date(lastMod),
		};
	});

	const marketingPages: MetadataRoute.Sitemap = [
		"/tailwind-cursor-styles",
		"/llms-text-generator",
	].map(url => ({
		url: `https://www.sammaji.com${url}`,
		changeFrequency: "monthly",
	}));

	return [
		{
			url: "https://www.sammaji.com",
			lastModified: new Date(),
		},
		{
			url: "https://www.sammaji.com/blog",
			changeFrequency: "weekly",
			lastModified: new Date(),
		},
		...blog,
		{
			url: "https://www.sammaji.com/work",
			lastModified: new Date(),
		},
		...work,
		...marketingPages,
	];
}
