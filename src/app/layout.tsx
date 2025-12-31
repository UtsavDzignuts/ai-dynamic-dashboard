import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Dashboard | React Server Components & LangChain",
  description:
    "An AI-driven dynamic dashboard using React Server Components, LangChain, and Recharts for data visualization based on natural language prompts.",
  keywords: [
    "React",
    "Next.js",
    "LangChain",
    "AI",
    "Dashboard",
    "React Server Components",
    "Recharts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
