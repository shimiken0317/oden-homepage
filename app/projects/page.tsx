import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
export const metadata: Metadata = { title: "プロジェクト" };
const projects=[{n:"01",title:"おでんログ",type:"PERSONAL APP",desc:"トレーニングと体調を無理なく記録できる、小さなアプリ。",tags:["Next.js","TypeScript"]},{n:"02",title:"読んだ本の棚",type:"KNOWLEDGE BASE",desc:"本の感想ではなく、あとで使いたい一節と考えを集めるデジタル本棚。",tags:["MDX","Search"]},{n:"03",title:"ちいさなAI道具箱",type:"EXPERIMENTS",desc:"日々の面倒を少しだけ減らす、生成AIの小さな実験を公開しています。",tags:["AI","Open Source"]}];
export default function ProjectsPage(){return <div className="shell page-wrap"><Breadcrumbs items={[{label:"つくったもの"}]} /><div className="page-title"><p className="kicker">Things I make</p><h1>つくったもの</h1><p>暮らしの中の「ちょっと面倒」を、小さく解く。</p></div><div className="project-list">{projects.map((p,i)=><article key={p.n} className={`project-card tone-${i}`}><span>{p.n}</span><div><small>{p.type}</small><h2>{p.title}</h2><p>{p.desc}</p><div>{p.tags.map(t=><b key={t}>{t}</b>)}</div></div><Link href="/contact" aria-label={`${p.title}について問い合わせる`}>↗</Link></article>)}</div></div>}
