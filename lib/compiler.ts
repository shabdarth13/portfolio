// A compact model of the stages in Smart Compiler: lexer, recursive-descent parser,
// constant folding (with propagation) and evaluation. Used by the live demo on the page.

export class CompileError extends Error {}
export type Tok = { type: "num" | "id" | "keyword" | "op"; text: string };
export type TreeNode = { label: string; kids: TreeNode[] };
type Expr = { k: "num"; v: number } | { k: "var"; n: string } | { k: "bin"; op: string; l: Expr; r: Expr };
type Stmt = { name: string | null; e: Expr };

export function lex(src: string): Tok[] {
  const out: Tok[] = [];
  const re = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_]\w*)|([-+*/=();]))/y;
  let pos = 0;
  while (pos < src.length && src.slice(pos).trim() !== "") {
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m) throw new CompileError(`Unexpected character '${src.slice(pos).trim()[0]}'`);
    pos = re.lastIndex;
    if (m[1]) out.push({ type: "num", text: m[1] });
    else if (m[2]) out.push({ type: m[2] === "let" ? "keyword" : "id", text: m[2] });
    else out.push({ type: "op", text: m[3] });
  }
  return out;
}

function parse(toks: Tok[]): Stmt[] {
  let i = 0;
  const peek = () => toks[i] as Tok | undefined;
  const eat = (text?: string): Tok => {
    const t = toks[i];
    if (!t) throw new CompileError(text ? `Expected '${text}' but the input ended` : "Unexpected end of input");
    if (text && t.text !== text) throw new CompileError(`Expected '${text}' but found '${t.text}'`);
    i++;
    return t;
  };
  const factor = (): Expr => {
    const t = eat();
    if (t.type === "num") return { k: "num", v: Number(t.text) };
    if (t.type === "id") return { k: "var", n: t.text };
    if (t.text === "(") { const e = expr(); eat(")"); return e; }
    if (t.text === "-") return { k: "bin", op: "-", l: { k: "num", v: 0 }, r: factor() };
    throw new CompileError(`Unexpected '${t.text}'`);
  };
  const level = (next: () => Expr, ops: string[]) => (): Expr => {
    let l = next();
    for (let t = peek(); t && ops.includes(t.text); t = peek()) l = { k: "bin", op: eat().text, l, r: next() };
    return l;
  };
  const term = level(factor, ["*", "/"]);
  const expr: () => Expr = level(term, ["+", "-"]);

  const prog: Stmt[] = [];
  while (i < toks.length) {
    let name: string | null = null;
    if (peek()?.type === "keyword") {
      eat();
      const n = eat();
      if (n.type !== "id") throw new CompileError(`'${n.text}' is not a valid name`);
      name = n.text;
      eat("=");
    }
    prog.push({ name, e: expr() });
    if (peek()?.text === ";") eat();
    else if (peek()) throw new CompileError(`Expected ';' before '${peek()!.text}'`);
  }
  return prog;
}

function fold(e: Expr, env: Map<string, number>): Expr {
  if (e.k === "num") return e;
  if (e.k === "var") {
    const v = env.get(e.n);
    if (v === undefined) throw new CompileError(`Undefined variable '${e.n}'`);
    return { k: "num", v };
  }
  const l = fold(e.l, env), r = fold(e.r, env);
  if (l.k !== "num" || r.k !== "num") return { k: "bin", op: e.op, l, r };
  if (e.op === "/" && r.v === 0) throw new CompileError("Division by zero");
  const v = e.op === "+" ? l.v + r.v : e.op === "-" ? l.v - r.v : e.op === "*" ? l.v * r.v : l.v / r.v;
  return { k: "num", v };
}

const show = (n: number) => String(+n.toFixed(6));
const node = (e: Expr): TreeNode =>
  e.k === "num" ? { label: show(e.v), kids: [] } : e.k === "var" ? { label: e.n, kids: [] } : { label: e.op, kids: [node(e.l), node(e.r)] };
const stmtNode = (s: Stmt, e: Expr): TreeNode => ({ label: s.name ? `let ${s.name}` : "expr", kids: [node(e)] });

export function compile(src: string) {
  const tokens = lex(src);
  const prog = parse(tokens);
  const env = new Map<string, number>();
  const results: { name: string | null; value: number }[] = [];
  const folded: TreeNode[] = [];
  for (const s of prog) {
    const f = fold(s.e, env);
    if (f.k !== "num") throw new CompileError("Could not reduce expression");
    if (s.name) env.set(s.name, f.v);
    results.push({ name: s.name, value: f.v });
    folded.push(stmtNode(s, f));
  }
  return { tokens, parsed: prog.map((s) => stmtNode(s, s.e)), folded, results, show };
}

export type Placed = { label: string; x: number; y: number; parent?: number };

export function place(roots: TreeNode[]) {
  const items: Placed[] = [];
  let leaf = 0, depth = 0;
  const go = (n: TreeNode, d: number, parent?: number): number => {
    const idx = items.length;
    depth = Math.max(depth, d);
    items.push({ label: n.label, x: 0, y: d, parent });
    if (!n.kids.length) items[idx].x = leaf++;
    else {
      const xs = n.kids.map((k) => go(k, d + 1, idx));
      items[idx].x = (xs[0] + xs[xs.length - 1]) / 2;
    }
    return items[idx].x;
  };
  roots.forEach((r) => go(r, 0));
  return { items, cols: Math.max(leaf, 1), rows: depth + 1 };
}
