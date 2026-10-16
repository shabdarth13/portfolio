# Shabdarth: Portfolio

Portfolio site built with **Next.js 15 (App Router), React 19 and TypeScript**. It is statically generated, has no runtime dependencies beyond Next and React, and deploys to Vercel with no configuration.

## Features

- **Live compiler demo** in the hero. `lib/compiler.ts` implements a lexer, recursive-descent parser and constant-folding pass (with variable propagation). Type code and watch the tokens and the syntax tree, drawn as SVG, update. It is a small model of Smart Compiler's pipeline, not the Flask app itself.
- **Live Redis demo.** `lib/redis.ts` is a typed, in-browser model of the JavaRedis command set (strings, lists, sets, hashes, expiry, type errors). It is a simulation, not the Java server, and the page says so.
- **Project showcase** with an accessible tab pattern (arrow keys work) and a data-flow diagram per project, built from the architecture in the CV.
- **Command palette**: press `Ctrl K` (or `/`) to jump to a section, copy the email address, or open GitHub and LinkedIn.
- **Scroll-aware navigation** with `IntersectionObserver`.
- **Content kept apart from layout**: all copy, links and pipelines live in `data/content.ts`, fully typed.
- Fonts via `next/font`, responsive layout, visible keyboard focus, reduced-motion support.

## Structure

```
app/
  layout.tsx        Fonts and metadata
  page.tsx          Page composition
  globals.css       Design tokens and styles
components/
  Nav.tsx           Sticky nav with scroll spy and palette button (client)
  Lab.tsx           Hero demos: compiler visualiser and Redis tab (client)
  Terminal.tsx      Redis terminal (client)
  Showcase.tsx      Project tabs and pipelines (client)
  Palette.tsx       Ctrl K command palette (client)
data/content.ts     Profile, projects, experience, skills, credentials
lib/redis.ts        MiniRedis: the command engine behind the terminal
lib/compiler.ts     Lexer, parser, constant folding and tree layout
public/shabdarth.jpg
```

## Run locally

Requires Node 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import it at vercel.com/new. The Next.js preset is detected automatically.
3. Every push to `main` redeploys.

## Editing

- **Content and links:** `data/content.ts`. To add a project, add an object to `projects` and a matching entry in `pipelines`.
- **Colours:** variables at the top of `app/globals.css` (`--pine`, `--orange`, `--paper`, `--ink`).
- **Fonts:** `app/layout.tsx`.
- **Photo:** replace `public/shabdarth.jpg` with a square image on a light background.
- **New terminal command:** add an entry to the `commands` table in `lib/redis.ts`: `[minimum args, handler]`.

## Notes

- Contact is a `mailto:` and `tel:` link only. There is no form or backend.
- The Smart Compiler is deployed on Render, but its live URL is not in the CV. Add a `live` field to its entry in `data/content.ts` if you want to show it.
