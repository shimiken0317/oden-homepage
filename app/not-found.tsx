import Image from "next/image";
import Link from "next/link";
export default function NotFound(){return <div className="not-found shell"><div><span>404</span><h1>その具は、まだ煮えていないみたい。</h1><p>ページが移動したか、URLが少し違うかもしれません。</p><Link className="button primary" href="/">トップへ戻る →</Link></div><Image src="/characters/oden-hero.png" alt="道に迷ったおでんくん" width={400} height={400}/></div>}
