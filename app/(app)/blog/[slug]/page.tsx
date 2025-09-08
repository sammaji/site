import RichText from "@/components/rich-text";
import { payload } from "@/lib/payload";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params as { slug: string };
    const data = await payload.find({
        collection: "blog",
        where: {
            // @ts-ignore
            ["seo.slug"]: slug,
        },
        select: {
            content: {
                title: true,
                description: true,
            },
            seo: {
                seo_title: true,
                seo_description: true,
                slug: true,
            },
        },
        limit: 1,
    });

    if (data.docs.length === 0) {
        return {
            title: "404 not found",
            description: "Page not found",
        } as Metadata;
    };

    const doc = data.docs[0];
    const title = doc.seo.seo_title || doc.content.title;
    const description = doc.seo.seo_description || "";

    const metadata: Metadata = {
        title,
        description,
        openGraph: { title, description },
        authors: [{ name: "Samyabrata Maji" }],
        publisher: "Samyabrata Maji",
        alternates: {
            canonical: `https://www.sammaji.tech/blog/${slug}`,
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
        },
        robots: "index, follow"
    };
    return metadata;
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const data = await payload.find({
        collection: "blog",
        where: {
            // @ts-ignore
            ["seo.slug"]: slug,
        }
    });

    if (!data || data.docs.length === 0) return notFound();
    const doc = data.docs[0];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl">{doc.content.title}</h1>
                <p className="text-sm inline-flex gap-1 items-center">Last edited on {format(doc.updatedAt, "LLL d, yyyy")}</p>
            </div>

            <RichText data={doc.content.content} />
        </div>
    );
}
