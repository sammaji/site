import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Metadata } from 'next';

const contentDir = path.join(process.cwd(), 'md', 'blog');

async function getPost(slug: string) {
    const filePath = path.join(contentDir, `${slug}.md`);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        return { data, content };
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: '404 Not Found',
            description: 'Page not found',
        };
    }

    const { data } = post;
    const title = data.seo_title || data.title;
    const description = data.seo_description || data.description || '';

    return {
        title,
        description,
        openGraph: { title, description },
        authors: [{ name: 'Samyabrata Maji' }],
        publisher: 'Samyabrata Maji',
        alternates: {
            canonical: `https://www.sammaji.tech/blog/${params.slug}`,
        },
        twitter: {
            title,
            description,
            card: 'summary_large_image',
        },
        robots: 'index, follow',
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

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
            <article className="prose dark:prose-invert">
                <MDXRemote source={content} />
            </article>
        </div>
    );
}