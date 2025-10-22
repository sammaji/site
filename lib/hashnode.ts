import axios from "axios";

type HashnodePost = {
	data: {
		publication: {
			post: {
				title: string;
				content: {
					markdown: string;
				};
				seo: {
					title: string;
					description: string;
				};
				ogMetaData: {
					image: string;
				};
				tags: {
					name: string;
				}[];
			};
		};
	};
};

export async function getHashnodePost(slug: string) {
	const query = `
query Publication {
  publication(host: "sammaji.hashnode.dev") {
    post(slug: "${slug}") {
      title
      content {
        markdown
      }
      seo {
        title
        description
      }
      ogMetaData {
        image
      }
      tags {
        name
      }
    }
  }
}
`;

	const { data } = await axios.post<HashnodePost>(
		"https://gql.hashnode.com",
		{
			query,
		},
	);

	return {
		title: data?.data?.publication?.post?.title,
		content: data?.data?.publication?.post?.content?.markdown.replace(
			/!\[(.*?)\]\((.*?)\s+align=".*?"\)/g,
			"![$1]($2)",
		),
		tags: data?.data?.publication?.post?.tags?.map(t => t.name),
		seo_title: data?.data?.publication?.post?.seo?.title,
		seo_description: data?.data?.publication?.post?.seo?.description,
		image: data?.data?.publication?.post?.ogMetaData?.image,
	};
}
