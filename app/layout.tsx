import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { getSiteUrl } from "./lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "おでんのページ", template: "%s｜おでんのページ" },
  description: "筋トレ、投資、プログラミング、夫婦の日々。おでんちゃんと、暮らしの知識をひとつずつ。",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ja_JP", siteName: "おでんのページ", title: "おでんのページ", description: "好きなことを、じっくり煮込む。", images: [{ url: "/characters/oden-sketch-sheet.png", width: 1395, height: 1154, alt: "妻が夫をイメージして描いた、おでんちゃんの原画" }] },
  twitter: { card: "summary_large_image", title: "おでんのページ", description: "好きなことを、じっくり煮込む。", images: ["/characters/oden-sketch-sheet.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
