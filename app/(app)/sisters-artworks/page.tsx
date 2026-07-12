import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ogImageUrl } from "@/lib/og";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const title = "My Sister's Artworks";
const description = "A small gallery of my sister's paintings and artworks.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "https://www.sammaji.com/sisters-artworks" },
	openGraph: {
		title,
		description,
		url: "https://www.sammaji.com/sisters-artworks",
		siteName: "Samyabrata Maji",
		type: "website",
		images: [ogImageUrl({ title, description })],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [ogImageUrl({ title, description })],
	},
};

type Work = {
	date?: string;
	title: string;
	thumbnail: string;
	imgClassName?: string;
};

const column_1: Work[] = [
	{
		title: "Rose",
		thumbnail: "/artworks/rose.jpeg",
	},
	{
		title: "Maa Swaraswati",
		thumbnail: "/artworks/pastel_maa_swaraswati.jpeg",
	},
	{
		title: "Fish Hook",
		thumbnail: "/artworks/fish_hook.jpeg",
	},
];

const column_2: Work[] = [
	{
		date: "2026-02-14",
		title: "Harmonium",
		thumbnail: "/artworks/harmonium.jpeg",
	},
	{
		date: "2026-04-25",
		title: "Red Rose",
		thumbnail: "/artworks/red_rose.jpeg",
		imgClassName: "aspect-3/4 object-cover",
	},
];

function ImageCard({
	title,
	thumbnail,
	imgClassName,
}: {
	title: string;
	thumbnail: string;
	imgClassName?: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="rounded">
					<img
						className={cn("w-full rounded", imgClassName)}
						src={thumbnail}
						alt={title}
					/>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="hidden">
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<img src={thumbnail} alt={title} className="w-full" />
			</DialogContent>
		</Dialog>
	);
}

export default function Page() {
	return (
		<div>
			<h2 className="mb-8 text-xl">✨ my sister's artworks ✨</h2>
			<div className="flex gap-2">
				<div className="flex-1 space-y-2">
					{column_1.map(work => (
						<ImageCard
							key={work.title}
							title={work.title}
							thumbnail={work.thumbnail}
							imgClassName={work.imgClassName}
						/>
					))}
				</div>
				<div className="flex-1 space-y-2">
					{column_2.map(work => (
						<ImageCard
							key={work.title}
							title={work.title}
							thumbnail={work.thumbnail}
							imgClassName={work.imgClassName}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
