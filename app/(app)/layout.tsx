import { Nav } from "@/components/nav";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Samyabrata Maji",
    description: "Full-stack engineer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${geistMono.variable} dark antialiased`}>
                <div className="text-gray-1200 mx-auto max-w-[692px] space-y-16 overflow-x-hidden px-6 py-12 antialiased sm:py-32 md:overflow-x-visible md:py-16">
                    <Nav />
                    {children}
                </div>
                <Analytics />
            </body>
        </html>
    );
}
