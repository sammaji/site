import { OgImage, height, width } from "@/components/og-image";
import { ImageResponse } from "@takumi-rs/image-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const title = searchParams.get("title") ?? "Samyabrata Maji";
	const description = searchParams.get("description") ?? undefined;

	return new ImageResponse(
		<OgImage title={title} description={description} />,
		{
			width,
			height,
			format: "webp",
			headers: {
				"Cache-Control": "public, immutable, no-transform, max-age=31536000",
			},
		},
	);
}
