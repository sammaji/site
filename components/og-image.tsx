export const width = 1200;
export const height = 630;

export function OgImage({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: "100%",
				height: "100%",
				padding: "80px",
				backgroundColor: "#0a0a0a",
				fontFamily: "Inter, sans-serif",
			}}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					flex: 1,
					maxWidth: "980px",
				}}>
				<h1
					style={{
						fontSize: "72px",
						fontWeight: 700,
						color: "#eeeeec",
						margin: 0,
						lineHeight: 1.1,
						letterSpacing: "-0.03em",
					}}>
					{title}
				</h1>
				{description && (
					<p
						style={{
							fontSize: "30px",
							fontWeight: 400,
							color: "#7c7b74",
							margin: 0,
							marginTop: "28px",
							lineHeight: 1.4,
							letterSpacing: "-0.01em",
						}}>
						{description}
					</p>
				)}
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
					fontSize: "24px",
					fontWeight: 600,
					color: "#b5b3ad",
				}}>
				<span>sammaji.com</span>
			</div>
		</div>
	);
}
