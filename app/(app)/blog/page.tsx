import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import cms from "@/public/cms.json";

type HashnodePosts = {
    data: {
        publication: {
            posts: {
                edges: {
                    node: {
                        title: string;
                        url: string;
                        slug: string;
                        publishedAt: string;
                    };
                }[];
            };
        };
    };
};

// Consolidated post type for rendering
type Post = {
    title: string;
    slug: string;
    publishedAt: Date;
    year: number;
    source: "hashnode" | "local";
};

async function getHashnodeBlogs(): Promise<HashnodePosts> {
    const { data } = await axios.post<HashnodePosts>(
        "https://gql.hashnode.com",
        {
            query: `
query Publication {
  publication(host: "sammaji.hashnode.dev") {
    posts(first: 50) {
      edges {
        node {
          title
          url
          slug
          publishedAt
        }
      }
    }
  }
}
` },
    );
    return data;
}

function groupBy(xs: any[], key: string) {
    return xs.reduce((rv: Record<string, any[]>, x: any) => {
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}

async function organisePosts(): Promise<Record<string, Post[]>> {
    const hashnodeData = await getHashnodeBlogs();

    const hashnodePosts = hashnodeData.data.publication.posts.edges.map(x => ({
        title: x.node.title,
        slug: x.node.slug,
        publishedAt: new Date(x.node.publishedAt),
        year: new Date(x.node.publishedAt).getFullYear(),
        source: "hashnode",
    }));

    const localPosts = cms.map((doc) => ({
        title: doc.title,
        slug: doc.slug,
        publishedAt: new Date(doc.published_at),
        year: new Date(doc.published_at).getFullYear(),
        source: "local",
    }));

    const sortedPosts = [...hashnodePosts, ...localPosts].sort(
        (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
    const groupedPosts = groupBy(sortedPosts, "year");
    return groupedPosts;
}

export default async function Page() {
    const data = await organisePosts();
    const sortedKeys = Object.keys(data).toSorted(
        (a, b) => parseInt(b) - parseInt(a),
    );
    return (
        <React.Fragment>
            <div>
                {sortedKeys.map((key, i) => {
                    const posts = data[key];
                    return (
                        <React.Fragment key={i}>
                            <div className="not-first:mt-8">
                                <h2 className="text-xl">{key}</h2>
                                <div>
                                    {posts.map((post, j) => {
                                        const date = format(
                                            post.publishedAt,
                                            "LL/dd",
                                        );
                                        return (
                                            <React.Fragment key={j}>
                                                <div className="transition-default flex items-center gap-2 py-4 hover:brightness-150">
                                                    <Link
                                                        href={post.source === "local" ? `/blog/${post.slug}` : `https://blog.sammaji.tech/${post.slug}`}
                                                        className="text-muted-foreground line-clamp-1 grow">
                                                        {post.title}
                                                    </Link>
                                                    <p>{date}</p>
                                                </div>
                                                {j !== posts.length - 1 && (
                                                    <hr />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </React.Fragment>
    );
}