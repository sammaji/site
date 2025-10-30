import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Metadata } from 'next';
import postsJson from '@/public/cms.json';
import "highlight.js/styles/github-dark-dimmed.css";
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import React from 'react';
import { getHashnodePost } from '@/lib/hashnode';

async function getPost(slug: string) {
    const post = postsJson.find(post => post.slug === slug);
    if (!post) {
        return null;
    }

    if (post.source === "hashnode") {
        const { title, content, image } = await getHashnodePost(post.slug);
        return { data: { title, image }, content };
    }

    // @ts-ignore
    if (!post.file) {
        return null;
    }

    // @ts-ignore
    const filePath = path.join(process.cwd(), 'md', 'blog', post.file);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        return { data, content };
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await props.params).slug;
    const post = await getPost(slug);

    if (!post) {
        return notFound();
    }

    const { data } = post;
    // @ts-ignore
    const title = data?.seo_title || data.title;

    // @ts-ignore
    const description = data?.seo_description || data.description || '';

    return {
        title,
        description,
        openGraph: { title, description, images: [data?.image] },
        authors: [{ name: 'Samyabrata Maji' }],
        publisher: 'Samyabrata Maji',
        alternates: {
            canonical: `https://www.sammaji.com/blog/${slug}`,
        },
        keywords: data?.tags,
        twitter: {
            title,
            description,
            images: [data?.image],
            card: 'summary_large_image',
        },
        robots: 'index, follow',
    };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const slug = (await props.params).slug;
    const post = await getPost(slug);

    if (!post) {
        return notFound();
    }

    const { data, content } = post;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl">{data.title}</h1>
                {data.last_edited_at && (
                    <p className="text-sm inline-flex gap-1 items-center">
                        Last edited on {format(new Date(data.last_edited_at), 'LLL d, yyyy')}
                    </p>
                )}
            </div>
            <article className="markdown prose dark:prose-invert">
                <MDXRemote source={content} options={{
                    mdxOptions: {
                        remarkPlugins: [remarkDirective, remarkGfm],
                        rehypePlugins: [rehypeHighlight]
                    }
                }} />
            </article>
        </div>
    );
}
