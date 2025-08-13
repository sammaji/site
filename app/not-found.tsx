import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function NotFound() {
	return (
		<React.Fragment>
			<div className="markdown">
				<h1>Page not found</h1>
				<p>
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Button className="group mt-8" asChild>
					<Link className="base" href="/">
						<ArrowLeftIcon className="transition-default group-hover:rotate-45" />{" "}
						Go back home
					</Link>
				</Button>
			</div>
		</React.Fragment>
	);
}
