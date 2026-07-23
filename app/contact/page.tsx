import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { OdenChan } from "../components/oden-chan";
export const metadata: Metadata = { title: "お問い合わせ", robots:{index:false,follow:true} };
export default function ContactPage(){return <div className="shell page-wrap"><Breadcrumbs items={[{label:"お問い合わせ"}]} /><section className="contact-panel"><div><p className="kicker">Say hello</p><h1>お問い合わせ</h1><p>記事の感想、制作の相談、誤字の連絡まで。夫婦でうれしく読ませていただきます。</p><a className="button primary" href="mailto:hello@example.com">メールを送る →</a><small>通常3日以内を目安に返信します。</small></div><OdenChan label="お問い合わせを待つおでんちゃん" /></section></div>}
