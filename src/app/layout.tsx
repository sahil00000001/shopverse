import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShopVerse - Premium Shopping Experience",
  description:
    "Discover a world of premium products at ShopVerse. Shop electronics, fashion, home & garden, sports, beauty, and books with free shipping, secure payments, and 24/7 support.",
  keywords: [
    "ecommerce",
    "online shopping",
    "premium products",
    "electronics",
    "fashion",
    "home decor",
  ],
  authors: [{ name: "ShopVerse" }],
  openGraph: {
    title: "ShopVerse - Premium Shopping Experience",
    description:
      "Discover a world of premium products at ShopVerse.",
    type: "website",
    locale: "en_US",
    siteName: "ShopVerse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
