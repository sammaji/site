import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

type Posts = {
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

const query = `
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
`;

async function getBlogs(): Promise<Posts> {
    const { data, status } = await axios.post<Posts>(
        "https://gql.hashnode.com",
        { query },
    );
    return data;
}

function groupBy(xs: any[], key: string) {
    return xs.reduce((rv: Record<string, any[]>, x: any) => {
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}

function organisePosts(posts: Posts): Record<string, any[]> {
    const reducedPosts = posts.data.publication.posts.edges.map(x => ({
        title: x.node.title,
        slug: x.node.slug,
        publishedAt: new Date(x.node.publishedAt),
        year: new Date(x.node.publishedAt).getFullYear(),
    }));
    const sortedPosts = reducedPosts.sort(
        (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
    const groupedPosts = groupBy(sortedPosts, "year");
    return groupedPosts as Record<string, any[]>;
}

export default async function Page() {
    const data = organisePosts(await getBlogs());
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
                            <div className="relative border-b first:border-t">
                                <p className="absolute top-4">{key}</p>

                                {posts.map((post, j) => {
                                    const date = format(
                                        post.publishedAt,
                                        "LL/dd",
                                    );
                                    return (
                                        <React.Fragment key={j}>
                                            <div className="flex justify-between gap-4 p-4 pl-[25%] last:pb-4">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="line-clamp-1 grow">
                                                    {post.title}
                                                </Link>
                                                <p>{date}</p>
                                            </div>
                                            {j !== post.length - 1 && (
                                                <div className="ml-[25%] h-[1px] w-auto bg-[#262626]"></div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </React.Fragment>
    );
}
