import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const column_1 = [
	{
		title: "Rose",
		thumbnail: "/artworks/rose.jpeg",
	},
	{
		title: "Maa Swaraswati",
		thumbnail: "/artworks/pastel_maa_swaraswati.jpeg",
	},
];

const column_2 = [
	{
		date: "2026-02-14",
		title: "Harmonium",
		thumbnail: "/artworks/harmonium.jpeg",
	},
];

function ImageCard({ title, thumbnail }: { title: string; thumbnail: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="rounded">
					<img
						className="w-full rounded"
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
				<div className="flex-1">
					{column_1.map(work => (
						<ImageCard key={work.title} {...work} />
					))}
				</div>
				<div className="flex-1">
					{column_2.map(work => (
						<ImageCard key={work.title} {...work} />
					))}
				</div>
			</div>
		</div>
	);
}
