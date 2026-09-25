# wow-name-guard

A proof-of-concept that mirrors World of Warcraft's character name picker and checks whether a chosen name passes a content-moderation guard powered by [Jev](https://openrouter.ai/docs/guides/community/jev-tutorial), the typed decision model on [OpenRouter](https://openrouter.ai).

The Name Guard judges **content only** (sexual, racist, other offensive material) of the full name — never WoW's formatting rules. Read `CONTEXT.md` for the project's domain language.

## Requirements

- Node.js 20+ (developed on Node 24)
- An [OpenRouter API key](https://openrouter.ai/settings/keys)

## Setup

```bash
npm install
cp .env.example .env   # then put your real key in .env
```

`.env` is git-ignored — the key is only ever read server-side.

## Running

```bash
npm run dev
```

This starts two processes via [concurrently](https://www.npmjs.com/package/concurrently):

| What            | URL                        | Purpose                                    |
| --------------- | -------------------------- | ------------------------------------------ |
| Hono API server | http://localhost:3001      | Holds the key, calls the Jev Decisions API |
| Vite dev server | http://localhost:5173      | The website — **open this one**            |

The Vite dev server proxies `/api/*` to the Hono server, so the browser only ever talks to http://localhost:5173.

## How to use

1. Type a first name and a surname (max 12 characters each, like WoW).
2. Click **Check Name** (or press Enter) — or use the 🎲 dice to fill in an example name from the test suite.
3. The verdict appears below the panel:
   - **Clean** — the name is fine
   - **Suspicious** — the model is unsure
   - **Flagged** — "You cannot use that name!"
4. Open the **Detail Panel** to see the raw Jev answers: the category (clean / sexual / racist / offensive / inauthentic), the `noul` probability, and the severity score.

## Scripts

| Command          | What it does                                                  |
| ---------------- | ------------------------------------------------------------- |
| `npm run dev`    | Run the app (API server + website)                            |
| `npm run test`   | Unit tests for the verdict/threshold logic (vitest, no API)   |
| `npm run suite`  | Run the example names against the **real** Jev API and print a markdown table — handy for tuning thresholds and for blog-post numbers |
| `npm run typecheck` | TypeScript strict check over client, server and scripts    |

## Architecture

```
shared/verdict.ts     pure verdict logic + thresholds (used by server, client and tests)
shared/examples.ts    example names used by the dice button and the suite script
server/index.ts       Hono server: POST /api/check
server/jev.ts         the Jev Decisions API call (noul + choice + score)
src/                  React frontend (Vite), WoW-styled UI in src/wow.css
scripts/suite.ts      live suite runner
tests/                vitest unit tests
```

One Jev request per check. Its `state` contains `first_name`, `surname` and the joined `full_name`, because banned content can span both parts ("Pe" + "nis"). The verdict applies to the whole name.

## Blog note

This repo exists as material for a blog post; the post itself is not part of this repository.
