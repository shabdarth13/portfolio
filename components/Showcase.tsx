"use client";

import { useState, type KeyboardEvent } from "react";
import { pipelines, projects } from "@/data/content";

export function Showcase() {
  const [i, setI] = useState(0);
  const p = projects[i];

  function onKey(e: KeyboardEvent) {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + projects.length) % projects.length;
    setI(n);
    document.getElementById(`tab-${n}`)?.focus();
  }

  return (
    <div className="show">
      <div className="show-list" role="tablist" aria-label="Projects" onKeyDown={onKey}>
        {projects.map((q, n) => (
          <button key={q.slug} id={`tab-${n}`} role="tab" aria-selected={n === i} aria-controls="panel"
            tabIndex={n === i ? 0 : -1} onClick={() => setI(n)}>
            <span className="num">{String(n + 1).padStart(2, "0")}</span>
            <span>{q.title}</span>
          </button>
        ))}
      </div>
      <div className="show-panel" id="panel" role="tabpanel" aria-labelledby={`tab-${i}`} key={p.slug}>
        <h3>{p.title}</h3>
        <p className="sum">{p.summary}</p>
        <ol className="pipe" aria-label="How it works">
          {pipelines[p.slug].map((s) => <li key={s}>{s}</li>)}
        </ol>
        <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        <p className="foot">
          <span>{p.stack.join(" / ")}</span>
          <a href={p.repo} target="_blank" rel="noopener noreferrer">Source on GitHub</a>
        </p>
      </div>
    </div>
  );
}
