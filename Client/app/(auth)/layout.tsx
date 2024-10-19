import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { dark } from "@clerk/themes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI - Compiler Auth",
  description: "A Next.js 13 Meta Threads Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
      <html lang="en">
        <body className={`${inter.className} h-screen bg-[rgb(0,0,0)] flex justify-center items-center`}>
            {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
