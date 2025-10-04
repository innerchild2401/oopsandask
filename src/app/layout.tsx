import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oops & Ask - AI-Powered Dramatic Communication",
  description: "Transform your messages into dramatic masterpieces. Generate over-the-top apologies and persuasive requests powered by AI.",
  keywords: "AI, apology, dramatic, multilingual, communication, GPT, language",
  authors: [{ name: "Oops & Ask Team" }],
  openGraph: {
    title: "Oops & Ask - AI-Powered Dramatic Communication",
    description: "Generate theatrical apologies and persuasive requests in any language",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oops & Ask - AI-Powered Dramatic Communication",
    description: "Transform your messages into dramatic masterpieces",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
