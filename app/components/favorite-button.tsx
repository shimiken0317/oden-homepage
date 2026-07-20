"use client";
import { useCallback, useSyncExternalStore } from "react";

export function FavoriteButton({ slug }: { slug: string }) {
  const subscribe = useCallback((notify: () => void) => { window.addEventListener("storage", notify); window.addEventListener("oden-favorites", notify); return () => { window.removeEventListener("storage", notify); window.removeEventListener("oden-favorites", notify); }; }, []);
  const getSnapshot = useCallback(() => JSON.parse(localStorage.getItem("oden-favorites") ?? "[]").includes(slug), [slug]);
  const saved = useSyncExternalStore(subscribe, getSnapshot, () => false);
  function toggle() { const list: string[] = JSON.parse(localStorage.getItem("oden-favorites") ?? "[]"); const next = saved ? list.filter((item) => item !== slug) : [...list, slug]; localStorage.setItem("oden-favorites", JSON.stringify(next)); window.dispatchEvent(new Event("oden-favorites")); }
  return <button className={`save-button ${saved ? "saved" : ""}`} onClick={toggle}>{saved ? "★ 保存済み" : "☆ あとで読む"}</button>;
}
