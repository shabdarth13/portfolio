"use client";

import { useMemo, useState } from "react";
import { CompileError, compile, place, type TreeNode } from "@/lib/compiler";
import { Terminal } from "./Terminal";

const DEFAULT = "let base = 2 + 3 * 4;\nlet total = base * (10 - 4) / 2;\ntotal + 1";

function Tree({ roots }: { roots: TreeNode[] }) {
  const { items, cols, rows } = place(roots);
  const X = 70, Y = 56;
  const w = cols * X, h = rows * Y;
  const px = (i: number) => items[i].x * X + X / 2;
  const py = (i: number) => items[i].y * Y + 24;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label="Syntax tree" className="tree">
      {items.map((n, i) => n.parent !== undefined && (
        <line key={`e${i}`} x1={px(n.parent)} y1={py(n.parent)} x2={px(i)} y2={py(i)} />
      ))}
      {items.map((n, i) => {
        const bw = Math.max(30, n.label.length * 8 + 16);
        return (
          <g key={i}>
            <rect x={px(i) - bw / 2} y={py(i) - 13} width={bw} height={26} rx={3} />
            <text x={px(i)} y={py(i) + 4} textAnchor="middle">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function CompilerPanel() {
  const [src, setSrc] = useState(DEFAULT);
  const [view, setView] = useState<"parsed" | "folded">("parsed");
  const out = useMemo(() => {
    try { return { ok: compile(src) }; }
    catch (e) { if (e instanceof CompileError) return { err: e.message }; throw e; }
  }, [src]);

  return (
    <div className="lab-body">
      <label htmlFor="src" className="sr">Source code</label>
      <textarea id="src" value={src} onChange={(e) => setSrc(e.target.value)} rows={4} spellCheck={false} />
      {"err" in out ? (
        <p className="lab-err" role="alert">Error: {out.err}</p>
      ) : (
        <>
          <p className="toks" aria-label="Tokens">
            {out.ok.tokens.map((t, i) => <span key={i} className={`tok-${t.type}`}>{t.text}</span>)}
          </p>
          <div className="seg" role="group" aria-label="Tree view">
            <button type="button" aria-pressed={view === "parsed"} onClick={() => setView("parsed")}>Parsed</button>
            <button type="button" aria-pressed={view === "folded"} onClick={() => setView("folded")}>After constant folding</button>
          </div>
          <div className="tree-wrap"><Tree roots={view === "parsed" ? out.ok.parsed : out.ok.folded} /></div>
          <p className="results">
            {out.ok.results.map((r, i) => <span key={i}>{r.name ?? "result"} = {out.ok.show(r.value)}</span>)}
          </p>
        </>
      )}
      <p className="note">A small model of the lexer, recursive-descent parser and constant-folding stages from Smart Compiler.</p>
    </div>
  );
}

export function Lab() {
  const [tab, setTab] = useState<"compiler" | "redis">("compiler");
  return (
    <div className="lab">
      <div className="lab-tabs" role="tablist" aria-label="Interactive demos">
        <button role="tab" aria-selected={tab === "compiler"} onClick={() => setTab("compiler")}>Compiler</button>
        <button role="tab" aria-selected={tab === "redis"} onClick={() => setTab("redis")}>Redis server</button>
      </div>
      {tab === "compiler" ? <CompilerPanel /> : <div className="lab-body"><Terminal /></div>}
    </div>
  );
}
