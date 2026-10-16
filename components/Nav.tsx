"use client";

import { useEffect, useState } from "react";

const items = [
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["contact", "Contact"],
] as const;

export function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav">
      <a href="#top" className="nav-mark">Shabdarth</a>
      <nav aria-label="Sections">
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>{label}</a>
        ))}
        <button type="button" className="kbd" onClick={() => window.dispatchEvent(new Event("open-palette"))}>
          Jump <kbd>Ctrl K</kbd>
        </button>
      </nav>
    </header>
  );
}
