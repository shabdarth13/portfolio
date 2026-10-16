"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/content";

type Item = { label: string; run: () => void | Promise<void> };

export function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [msg, setMsg] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const close = () => { setOpen(false); setQ(""); setSel(0); setMsg(""); };
  const go = (id: string) => () => { location.hash = id; close(); };

  const items: Item[] = useMemo(() => [
    { label: "Go to projects", run: go("projects") },
    { label: "Go to experience", run: go("experience") },
    { label: "Go to skills", run: go("skills") },
    { label: "Go to contact", run: go("contact") },
    { label: "Copy email address", run: async () => { await navigator.clipboard.writeText(profile.email); setMsg("Email copied"); setTimeout(close, 700); } },
    { label: "Open GitHub", run: () => { window.open(profile.github, "_blank", "noopener"); close(); } },
    { label: "Open LinkedIn", run: () => { window.open(profile.linkedin, "_blank", "noopener"); close(); } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);
  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).matches?.("input, textarea");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-palette", onOpen); };
  }, []);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  if (!open) return null;

  return (
    <div className="pal-back" onMouseDown={close}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Jump to" onMouseDown={(e) => e.stopPropagation()}>
        <input ref={input} value={q} placeholder="Jump to, copy, open" aria-label="Search commands"
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === "Enter") shown[sel]?.run();
          }} />
        <ul role="listbox">
          {shown.map((it, n) => (
            <li key={it.label} role="option" aria-selected={n === sel} onMouseEnter={() => setSel(n)} onClick={() => it.run()}>{it.label}</li>
          ))}
          {!shown.length && <li className="none">Nothing matches</li>}
        </ul>
        <p>{msg || "Enter to run, Esc to close"}</p>
      </div>
    </div>
  );
}
