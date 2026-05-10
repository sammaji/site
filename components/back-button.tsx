"use client";

import { ArrowUpLeft } from "lucide-react";

export function BackButton() {
	return (
		<p
			onClick={() => history.back()}
			className="hover:text-primary transition-default text-muted-foreground absolute inline-flex -translate-x-full cursor-pointer items-center pr-32">
			<ArrowUpLeft className="size-5" /> Back
		</p>
	);
}
