import axios from "axios";

type HashnodePost = {
	data: {
		publication: {
			post: {
				title: string;
				content: {
					markdown: string;
				};
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
    }
  }
}`;

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
	};
}
