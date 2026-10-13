import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/shared/components/Navbar";
import { AuthModal } from "@/features/auth/components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FDE Roadmap & Courses | Enterprise Career Platform",
  description: "Master Forward Deployed Engineering: Full-Stack Systems, Data Pipelines, Cloud Infrastructure, and Client Enterprise Discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <div className="flex-1">{children}</div>
        <AuthModal />
      </body>
    </html>
  );
}
