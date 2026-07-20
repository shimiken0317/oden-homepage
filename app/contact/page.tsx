import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "../components/breadcrumbs";
export const metadata: Metadata = { title: "お問い合わせ", robots:{index:false,follow:true} };
export default function ContactPage(){return <div className="shell page-wrap"><Breadcrumbs items={[{label:"お問い合わせ"}]} /><section className="contact-panel"><div><p className="kicker">Say hello</p><h1>お問い合わせ</h1><p>記事の感想、制作の相談、誤字の連絡まで。気軽に声をかけてください。</p><a className="button primary" href="mailto:hello@example.com">メールを送る →</a><small>通常3日以内を目安に返信します。</small></div><Image src="/characters/oden-hero.png" alt="おでんくん" width={300} height={300}/></section></div>}
