import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { OdenChan } from "../components/oden-chan";
export const metadata: Metadata = { title: "お問い合わせ", robots:{index:false,follow:true} };
export default function ContactPage(){return <div className="shell page-wrap"><Breadcrumbs items={[{label:"お問い合わせ"}]} /><section className="contact-panel"><div><p className="kicker">Say hello</p><h1>お問い合わせ</h1><p>記事の感想や誤字のご連絡、制作のご相談など、お気軽にお寄せください。二人で大切に拝見します。</p><a className="button primary" href="mailto:hello@example.com">メールを送る →</a><small>通常は3日以内に返信します。</small></div><OdenChan label="お問い合わせを待つおでんちゃん" /></section></div>}
