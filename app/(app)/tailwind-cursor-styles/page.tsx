"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const cursorUtilities = [
	{ className: "cursor-auto", cssValue: "auto" },
	{ className: "cursor-default", cssValue: "default" },
	{ className: "cursor-pointer", cssValue: "pointer" },
	{ className: "cursor-wait", cssValue: "wait" },
	{ className: "cursor-text", cssValue: "text" },
	{ className: "cursor-move", cssValue: "move" },
	{ className: "cursor-help", cssValue: "help" },
	{ className: "cursor-not-allowed", cssValue: "not-allowed" },
	{ className: "cursor-none", cssValue: "none" },
	{ className: "cursor-context-menu", cssValue: "context-menu" },
	{ className: "cursor-progress", cssValue: "progress" },
	{ className: "cursor-cell", cssValue: "cell" },
	{ className: "cursor-crosshair", cssValue: "crosshair" },
	{ className: "cursor-vertical-text", cssValue: "vertical-text" },
	{ className: "cursor-alias", cssValue: "alias" },
	{ className: "cursor-copy", cssValue: "copy" },
	{ className: "cursor-no-drop", cssValue: "no-drop" },
	{ className: "cursor-grab", cssValue: "grab" },
	{ className: "cursor-grabbing", cssValue: "grabbing" },
	{ className: "cursor-all-scroll", cssValue: "all-scroll" },
	{ className: "cursor-col-resize", cssValue: "col-resize" },
	{ className: "cursor-row-resize", cssValue: "row-resize" },
	{ className: "cursor-n-resize", cssValue: "n-resize" },
	{ className: "cursor-e-resize", cssValue: "e-resize" },
	{ className: "cursor-s-resize", cssValue: "s-resize" },
	{ className: "cursor-w-resize", cssValue: "w-resize" },
	{ className: "cursor-ne-resize", cssValue: "ne-resize" },
	{ className: "cursor-nw-resize", cssValue: "nw-resize" },
	{ className: "cursor-se-resize", cssValue: "se-resize" },
	{ className: "cursor-sw-resize", cssValue: "sw-resize" },
	{ className: "cursor-ew-resize", cssValue: "ew-resize" },
	{ className: "cursor-ns-resize", cssValue: "ns-resize" },
	{ className: "cursor-nesw-resize", cssValue: "nesw-resize" },
	{ className: "cursor-nwse-resize", cssValue: "nwse-resize" },
	{ className: "cursor-zoom-in", cssValue: "zoom-in" },
	{ className: "cursor-zoom-out", cssValue: "zoom-out" },
] as const;

export default function TailwindCursorStylesPage() {
	const [query, setQuery] = useState("");
	const [copiedValue, setCopiedValue] = useState<string | null>(null);
	const copiedTimeout = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (copiedTimeout.current !== null) {
				window.clearTimeout(copiedTimeout.current);
			}
		};
	}, []);

	const filteredCursors = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) {
			return cursorUtilities;
		}

		return cursorUtilities.filter(cursor => {
			return (
				cursor.className.toLowerCase().includes(normalized) ||
				cursor.cssValue.toLowerCase().includes(normalized)
			);
		});
	}, [query]);

	const showCopied = (value: string) => {
		setCopiedValue(value);
		if (copiedTimeout.current !== null) {
			window.clearTimeout(copiedTimeout.current);
		}
		copiedTimeout.current = window.setTimeout(() => {
			setCopiedValue(null);
		}, 1200);
	};

	const copyText = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			showCopied(value);
		} catch {
			const fallback = document.createElement("textarea");
			fallback.value = value;
			document.body.appendChild(fallback);
			fallback.select();
			document.execCommand("copy");
			document.body.removeChild(fallback);
			showCopied(value);
		}
	};

	return (
		<main className="space-y-6">
			<header className="space-y-3">
				<h1 className="text-gray-1200 text-3xl">
					Tailwind Cursor Styles
				</h1>
				<p className="text-gray-1100">
					Search by Tailwind utility or CSS value. Click either value
					to copy it.
				</p>
			</header>

			<section className="space-y-3">
				<label htmlFor="cursor-search" className="sr-only">
					Search cursors
				</label>
				<input
					id="cursor-search"
					type="search"
					value={query}
					onChange={event => setQuery(event.target.value)}
					placeholder="Search cursor class or CSS value..."
					className="focus:ring-primary/40 text-primary placeholder:text-muted-foreground bg-primary-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
				/>
				{copiedValue && (
					<p className="text-gray-1000 text-xs">
						Copied: <span className="font-mono">{copiedValue}</span>
					</p>
				)}
			</section>

			<section className="overflow-hidden rounded-xl border">
				<table className="w-full table-fixed text-left">
					<thead className="bg-primary-foreground border-b text-sm">
						<tr>
							<th className="w-1/3 px-4 py-3 font-medium">
								Tailwind Property
							</th>
							<th className="w-1/3 px-4 py-3 font-medium">
								CSS Property
							</th>
							<th className="w-1/3 px-4 py-3 font-medium">
								Preview
							</th>
						</tr>
					</thead>
					<tbody className="divide-y text-sm">
						{filteredCursors.map(cursor => (
							<tr key={cursor.className} className="align-middle">
								<td className="p-4">
									<button
										type="button"
										onClick={() =>
											copyText(cursor.className)
										}
										className="focus:ring-primary/40 bg-secondary-foreground/10 rounded-md px-2 py-1 text-left font-mono break-all transition focus:ring-2 focus:outline-none">
										{cursor.className}
									</button>
								</td>
								<td className="p-4">
									<button
										type="button"
										onClick={() =>
											copyText(cursor.cssValue)
										}
										className="focus:ring-primary/40 bg-secondary-foreground/10 rounded-md px-2 py-1 text-left font-mono break-all transition focus:ring-2 focus:outline-none">
										{cursor.cssValue}
									</button>
								</td>
								<td className="p-4">
									<div
										className={`text-gray-1100 flex h-14 w-full items-center justify-center rounded-md border border-dashed border-gray-600 bg-gray-300/60 text-xs ${cursor.className}`}>
										Hover preview
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			{filteredCursors.length === 0 && (
				<p className="text-gray-1000 text-sm">
					No cursor styles match your search.
				</p>
			)}
		</main>
	);
}
