import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { articles } from "../lib/articles";
import { SearchClient } from "./search-client";
export const metadata: Metadata = { title: "記事を検索", robots: { index: false, follow: true } };
export default function SearchPage(){return <div className="shell page-wrap"><Breadcrumbs items={[{label:"検索"}]} /><div className="page-title"><p className="kicker">Search notes</p><h1>記事を検索</h1><p>タイトル・本文・タグから、すばやく探せます。</p></div><SearchClient articles={articles}/></div>}
