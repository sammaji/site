import { Markdown } from "@/components/markdown";
import axios from "axios";
import { format } from "date-fns";
import { Metadata } from "next";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const query = `
query Publication {
    publication(host: "sammaji.hashnode.dev") {
        post(slug: "${slug}") {
            seo {
                title
                description
            }
            ogMetaData {
                image
            }
        }
    }
}
`;
    const { data } = await axios.post("https://gql.hashnode.com", {
        query,
    });

    if (data.data.publication.post === null) return { title: "404 not found", description: "Page not found" } as Metadata;

    const metadata: Metadata = {
        title: data.data.publication.post.seo.title,
        description: data.data.publication.post.seo.description,
        openGraph: {
            title: data.data.publication.post.seo.title,
            description: data.data.publication.post.seo.description,
            images: {
                url: data.data.publication.post.ogMetaData.image,
            },
        },
        twitter: {
            title: data.data.publication.post.seo.title,
            description: data.data.publication.post.seo.description,
            card: "summary_large_image",
            images: { url: data.data.publication.post.ogMetaData.image },
        },
    }

    return metadata;
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
