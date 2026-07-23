import Link from "next/link";
import { OdenChan } from "./components/oden-chan";
export default function NotFound(){return <div className="not-found shell"><div><span>404</span><h1>その具は、まだ煮えていないみたい。</h1><p>ページが移動したか、URLが少し違うかもしれません。</p><Link className="button primary" href="/">トップへ戻る →</Link></div><OdenChan label="少し困りながらも一生懸命な、おでんちゃん" /></div>}
