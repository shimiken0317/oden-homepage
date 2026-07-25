"use client";
import { useMemo, useState } from "react";
import { ArticleCard } from "../components/article-card";
import type { SearchPostSummary } from "../lib/posts";
import { OdenChan } from "../components/oden-chan";
export function SearchClient({articles}:{articles:SearchPostSummary[]}) { const [query,setQuery]=useState(""); const result=useMemo(()=>{const q=query.trim().toLowerCase(); if(!q) return articles; return articles.filter(a=>[a.title,a.excerpt,a.category,...a.tags,a.searchText].join(" ").toLowerCase().includes(q));},[query,articles]); return <><label className="search-box"><span>⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="キーワード、カテゴリー、タグで検索" /><kbd>ESC</kbd></label><div className="search-summary"><span>{query ? `「${query}」の検索結果` : "すべての記事"}</span><b>{result.length} 件</b></div>{result.length ? <div className="article-grid listing">{result.map((a,i)=><ArticleCard article={a} index={i} key={a.slug}/>)}</div> : <div className="empty-state"><OdenChan label="検索を一生懸命手伝うおでんちゃん" /><h2>見つからなかったみたい。</h2><p>ことばを短くするか、カテゴリーから探してみてね。</p></div>}</>; }
