export default function Layout({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	return (
		<div className="text-gray-1200 mx-auto max-w-[692px] space-y-16 overflow-x-hidden px-6 py-12 antialiased sm:py-32 md:overflow-x-visible md:py-16">
			{children}
		</div>
	);
}
