import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["next-mdx-remote"],
	redirects: async () => [
		{
			source: "/resume",
			destination: "/Samyabrata-Maji-FullStackDeveloper.pdf",
			permanent: true,
		},
	],
};

export default nextConfig;
