import { Markdown } from "@/components/markdown";
import axios from "axios";
import { format } from "date-fns";
import { notFound } from "next/navigation";

type Post = {
	data: {
		publication: {
			post: {
				title: string;
				publishedAt: string;
				content: {
					markdown: string;
					html: string;
				} | null;
			};
		};
	};
};

async function getPost(slug: string) {
	const query = `
query Publication {
    publication(host: "sammaji.hashnode.dev") {
        post(slug: "${slug}") {
            title
            publishedAt
            content {
                markdown
                html
            }
        }
    }
}
`;

	const { data } = await axios.post<Post>("https://gql.hashnode.com", {
		query,
	});
	return data;
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const data = await getPost(slug);

	console.log(data);

	if (data.data.publication.post.content === null) return notFound();

	const publishedAt = format(
		new Date(data.data.publication.post.publishedAt),
		"MMMM dd, yyyy",
	);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-semibold">
					{data.data.publication.post.title}
				</h1>
				<p className="font-medium">{publishedAt}</p>
			</div>
			<Markdown html={data.data.publication.post.content.html} />
		</div>
	);
}
