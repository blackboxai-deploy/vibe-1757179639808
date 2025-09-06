import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3D Samosa Generator | AI-Powered Food Photography",
  description: "Create hyper-realistic 3D samosa scenes with AI. Generate beautiful food photography with customizable lighting, backgrounds, and styling options.",
  keywords: ["3D food rendering", "AI image generation", "samosa photography", "food styling", "culinary art"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-gradient-to-br from-orange-50 to-red-50")}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}