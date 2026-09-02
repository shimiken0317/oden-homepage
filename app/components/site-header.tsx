"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); onScroll(); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  function toggleTheme() { const dark = document.documentElement.dataset.theme !== "dark"; document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("oden-theme", dark ? "dark" : "light"); }
  useEffect(() => { const saved = localStorage.getItem("oden-theme"); if (saved) document.documentElement.dataset.theme = saved; }, []);
  const nav = [["/articles", "記事"], ["/categories", "カテゴリー"], ["/about", "このサイトについて"], ["/projects", "つくったもの"]];
  return <header className={`site-header ${scrolled ? "scrolled" : ""}`}><div className="header-inner shell">
    <Link href="/" className="brand" aria-label="おでんのページ トップ"><span className="brand-mark"><i /><b /></span><span>おでんのページ<small>ODEN NO PAGE</small></span></Link>
    <nav className={menu ? "open" : ""}>{nav.map(([href, label]) => <Link className={pathname === href ? "active" : ""} href={href} key={href} onClick={() => setMenu(false)}>{label}</Link>)}</nav>
    <div className="header-actions"><button onClick={toggleTheme} className="icon-button" aria-label="カラーモードを切り替える">◐</button><Link href="/search" className="icon-button" aria-label="検索">⌕</Link><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="メニュー">{menu ? "×" : "☰"}</button></div>
  </div></header>;
}
