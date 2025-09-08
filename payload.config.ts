import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

export default buildConfig({
	editor: lexicalEditor(),
	collections: [
		{
			slug: "blog",
			labels: {
				singular: "Blog",
				plural: "Blogs",
			},
			fields: [
				{
					type: "tabs",
					tabs: [
						{
							name: "content",
							fields: [
								{
									type: "text",
									name: "title",
									label: "Title",
									required: true,
									minLength: 10,
								},
								{
									type: "richText",
									name: "content",
									label: "Content",
									required: true,
								},
							],
						},
						{
							name: "seo",
							fields: [
								{
									type: "text",
									name: "seo_title",
									label: "SEO Title",
									required: false,
								},
								{
									type: "textarea",
									name: "seo_description",
									label: "SEO Description",
									required: false,
								},
								{
									type: "text",
									name: "slug",
									label: "Slug",
									required: true,
									unique: true,
									index: true,
								},
							],
						},
					],
				},
			],
		},
	],
	secret: process.env.PAYLOAD_SECRET!,
	db: postgresAdapter({
		pool: { connectionString: process.env.PG_DATABASE_URL },
	}),
	sharp,
});
