"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MiniRedis } from "@/lib/redis";

type Line = { kind: "in" | "out" | "err"; text: string };

const EXAMPLE = [
  "SET visits 10",
  "INCR visits",
  "LPUSH stack a b c",
  "LRANGE stack 0 -1",
  "HSET me city dehradun",
  "HGETALL me",
  "EXPIRE visits 30",
  "TTL visits",
];

export function Terminal() {
  const [redis] = useState(() => new MiniRedis());
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "JavaRedis speaks RESP2 over TCP. This is a small browser model of it." },
    { kind: "out", text: "Try: SET name shabdarth, then GET name. Arrow up repeats a command." },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines]);

  function run(cmds: string[]) {
    const next: Line[] = [];
    for (const c of cmds) {
      const r = redis.execute(c);
      next.push({ kind: "in", text: c }, { kind: r.error ? "err" : "out", text: r.text });
      history.current.push(c);
    }
    cursor.current = history.current.length;
    setLines((l) => [...l, ...next]);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const c = value.trim();
    if (c) run([c]);
    setValue("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const h = history.current;
    cursor.current = Math.min(Math.max(cursor.current + (e.key === "ArrowUp" ? -1 : 1), 0), h.length);
    setValue(h[cursor.current] ?? "");
  }

  return (
    <div className="term">
      <div className="term-bar">
        <span>javaredis</span>
        <button type="button" onClick={() => run(EXAMPLE)}>Run example</button>
      </div>
      <div className="term-log" ref={log} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`t-${l.kind}`}>{l.kind === "in" ? `> ${l.text}` : l.text}</div>
        ))}
      </div>
      <form onSubmit={submit} className="term-form">
        <label htmlFor="cmd" className="sr">Redis command</label>
        <span aria-hidden>&gt;</span>
        <input id="cmd" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
          placeholder="PING" spellCheck={false} autoComplete="off" autoCapitalize="off" />
      </form>
    </div>
  );
}
