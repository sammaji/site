"use client";

import { Nav } from "@/components/nav";
import { usePathname } from "next/navigation";

/** Routes that render their own full-viewport layout, without the shared site layout. */
const fullPageRoutes = ["/notepad"];

export function SiteLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	if (fullPageRoutes.includes(pathname)) {
		return <>{children}</>;
	}

	return (
		<div className="text-gray-1200 mx-auto max-w-[692px] space-y-16 overflow-x-hidden px-6 py-12 antialiased sm:py-32 md:overflow-x-visible md:py-16">
			<Nav />
			{children}
		</div>
	);
}
