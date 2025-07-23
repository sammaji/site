import { Nav } from "@/components/nav";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
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
                className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
                <div className="text-gray-1200 mx-auto max-w-[692px] space-y-16 overflow-x-hidden px-6 py-12 antialiased sm:py-32 md:overflow-x-visible md:py-16">
                    <Nav />
                    {children}
                </div>
            </body>
        </html>
    );
}
