// A small in-browser model of a subset of JavaRedis commands, used by the hero terminal.
// It is a simulation for demonstration; the real server is the Java project.

type Val =
  | { t: "string"; v: string }
  | { t: "list"; v: string[] }
  | { t: "set"; v: Set<string> }
  | { t: "hash"; v: Record<string, string> };

export type Reply = null | number | string | string[] | { status: string };
export type Result = { text: string; error: boolean };

class RedisError extends Error {}
const WRONGTYPE = "WRONGTYPE Operation against a key holding the wrong kind of value";

export class MiniRedis {
  private db = new Map<string, Val>();
  private expiry = new Map<string, number>();

  private live(key: string): boolean {
    const at = this.expiry.get(key);
    if (at !== undefined && at <= Date.now()) {
      this.db.delete(key);
      this.expiry.delete(key);
    }
    return this.db.has(key);
  }

  private entry<T extends Val["t"]>(key: string, t: T, make?: () => Extract<Val, { t: T }>["v"]) {
    if (!this.live(key)) {
      if (!make) return null;
      this.db.set(key, { t, v: make() } as Val);
    }
    const e = this.db.get(key)!;
    if (e.t !== t) throw new RedisError(WRONGTYPE);
    return e as Extract<Val, { t: T }>;
  }

  private step(key: string, by: number): number {
    const e = this.entry(key, "string", () => "0")!;
    const n = Number(e.v);
    if (!Number.isInteger(n)) throw new RedisError("ERR value is not an integer or out of range");
    e.v = String(n + by);
    return n + by;
  }

  // [minimum argument count, handler]
  private commands: Record<string, [number, (a: string[]) => Reply]> = {
    PING: [0, () => ({ status: "PONG" })],
    SET: [2, ([k, v]) => { this.db.set(k, { t: "string", v }); this.expiry.delete(k); return { status: "OK" }; }],
    GET: [1, ([k]) => this.entry(k, "string")?.v ?? null],
    DEL: [1, (ks) => { let n = 0; for (const k of ks) if (this.live(k)) { this.db.delete(k); this.expiry.delete(k); n++; } return n; }],
    EXISTS: [1, (ks) => ks.filter((k) => this.live(k)).length],
    INCR: [1, ([k]) => this.step(k, 1)],
    DECR: [1, ([k]) => this.step(k, -1)],
    EXPIRE: [2, ([k, s]) => { if (!this.live(k)) return 0; this.expiry.set(k, Date.now() + Number(s) * 1000); return 1; }],
    TTL: [1, ([k]) => { if (!this.live(k)) return -2; const at = this.expiry.get(k); return at === undefined ? -1 : Math.ceil((at - Date.now()) / 1000); }],
    LPUSH: [2, ([k, ...v]) => { const l = this.entry(k, "list", () => [])!.v; v.forEach((x) => l.unshift(x)); return l.length; }],
    RPUSH: [2, ([k, ...v]) => { const l = this.entry(k, "list", () => [])!.v; l.push(...v); return l.length; }],
    LRANGE: [3, ([k, a, b]) => {
      const l = this.entry(k, "list")?.v ?? [];
      const at = (i: number) => (i < 0 ? i + l.length : i);
      return l.slice(Math.max(at(Number(a)), 0), at(Number(b)) + 1);
    }],
    SADD: [2, ([k, ...v]) => { const s = this.entry(k, "set", () => new Set<string>())!.v; return v.filter((x) => !s.has(x) && s.add(x)).length; }],
    SMEMBERS: [1, ([k]) => [...(this.entry(k, "set")?.v ?? [])]],
    HSET: [3, ([k, f, v]) => { const h = this.entry(k, "hash", () => ({}))!.v; const fresh = !(f in h); h[f] = v; return fresh ? 1 : 0; }],
    HGETALL: [1, ([k]) => Object.entries(this.entry(k, "hash")?.v ?? {}).flat()],
  };

  execute(line: string): Result {
    const parts = (line.match(/"[^"]*"|\S+/g) ?? []).map((p) => p.replace(/^"|"$/g, ""));
    const cmd = this.commands[parts[0]?.toUpperCase() ?? ""];
    if (!cmd) return { text: `ERR unknown command '${parts[0]}'`, error: true };
    if (parts.length - 1 < cmd[0]) return { text: `ERR wrong number of arguments for '${parts[0].toLowerCase()}' command`, error: true };
    try {
      return { text: format(cmd[1](parts.slice(1))), error: false };
    } catch (e) {
      if (e instanceof RedisError) return { text: e.message, error: true };
      throw e;
    }
  }
}

function format(r: Reply): string {
  if (r === null) return "(nil)";
  if (typeof r === "number") return `(integer) ${r}`;
  if (typeof r === "string") return JSON.stringify(r);
  if (Array.isArray(r)) return r.length ? r.map((x, i) => `${i + 1}) ${JSON.stringify(x)}`).join("\n") : "(empty array)";
  return r.status;
}
