import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space",
});

export const metadata: Metadata = {
    title: "Radish | Gamified Sustainability",
    description: "Your gamified journey to a sustainable future. Track your eco-actions, earn XP, and compete with friends.",
    keywords: ["sustainability", "eco-friendly", "gamification", "recycling", "carbon footprint"],
    authors: [{ name: "Radish Team" }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
