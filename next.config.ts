import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["next-mdx-remote"],
	serverExternalPackages: ["@takumi-rs/image-response"],
	redirects: async () => [
		{
			source: "/resume",
			destination: "/Samyabrata-Maji-FullStackDeveloper.pdf",
			permanent: true,
		},
		{
			source: "/work/browser-react-preview",
			destination: "/blog/browser-react-preview",
			permanent: true,
		},
	],
	rewrites: async () => [
		{
			source: "/:path*.md",
			destination: "/api/md/:path*",
		},
	],
};

export default nextConfig;
