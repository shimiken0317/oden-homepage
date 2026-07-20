import Link from "next/link";
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) { return <nav className="breadcrumbs" aria-label="パンくず"><Link href="/">ホーム</Link>{items.map((item) => <span key={item.label}>／ {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</span>)}</nav>; }
