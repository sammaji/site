"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar as GitHubCalendarNative } from "react-github-calendar";

function GithubCalendarMounted() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<GitHubCalendarNative
			className="contributions-calendar w-full"
			username="sammaji"
			blockSize={10}
			blockMargin={2}
			blockRadius={2}
		/>
	);
}

export function GithubCalendar() {
	return (
		<div className="space-y-8">
			<h2 className="text-xl">Contributions</h2>
			<GithubCalendarMounted />
		</div>
	);
}
