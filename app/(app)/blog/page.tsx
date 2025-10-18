import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import cms from "@/public/cms.json";

// Consolidated post type for rendering
type Post = {
    title: string;
    slug: string;
    publishedAt: Date;
    year: number;
    source: "hashnode" | "local";
};

function groupBy(xs: any[], key: string) {
    return xs.reduce((rv: Record<string, any[]>, x: any) => {
        (rv[x[key]] ??= []).push(x);
        return rv;
    }, {});
}

async function organisePosts(): Promise<Record<string, Post[]>> {
    const posts = cms.map((doc) => ({
        title: doc.title,
        slug: doc.slug,
        publishedAt: new Date(doc.published_at),
        year: new Date(doc.published_at).getFullYear(),
        source: doc.source as "hashnode" | "local",
    }));

    const groupedPosts = groupBy(posts, "year");
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
                                                        href={`https://www.sammaji.com/blog/${post.slug}`}
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
