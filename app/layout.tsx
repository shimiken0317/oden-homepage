import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
});

const zen = Zen_Maru_Gothic({
  variable: "--font-zen",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://oden-no-page.shimiken4123.chatgpt.site"),
  title: { default: "おでんのページ", template: "%s｜おでんのページ" },
  description: "筋トレ、AI、プログラミング。おでんくんと、暮らしの知識をひとつずつ。",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ja_JP", siteName: "おでんのページ", title: "おでんのページ", description: "好きなことを、じっくり煮込む。", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "おでんのページ" }] },
  twitter: { card: "summary_large_image", title: "おでんのページ", description: "好きなことを、じっくり煮込む。", images: ["/og.png"] },
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
      <body className={`${noto.variable} ${zen.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
