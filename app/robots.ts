import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/"],
				disallow: "/api/",
			},
			{
				userAgent: "AdsBot-Google", // Google adsbot ignores robots.txt unless specifically named!
				allow: ["/"],
				disallow: "/api/",
			},
		],
		sitemap: "https://www.sammaji.tech/sitemap.xml",
	};
}
