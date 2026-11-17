# my-stocks

Live stock board UI for RupeeFarm, built with React + TypeScript + Vite + Tailwind and Firebase Firestore.

- **Title:** Stocks (₹)
- **Live data:** Firestore `rupeefarm/board_latest` (read-only, realtime via `onSnapshot`)
- **Hosting target:** `mystocks.ravikloyi.in` (Cloudflare Workers static assets via GitHub)

## Setup

```bash
cd "my-stocks"
npm install
cp .env.example .env.local  # or edit existing .env.local
npm run dev
```

### Environment (`.env.local` / Cloudflare)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=rupeefarm-80634.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rupeefarm-80634
VITE_FIREBASE_STORAGE_BUCKET=rupeefarm-80634.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Use the Firebase **Web app** config from Project settings → General → Your apps. (Not the service account.)
**Important:** set these same `VITE_FIREBASE_*` variables in Cloudflare Pages for Production (and Preview if needed), because Vite bakes them in at build time.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint
- `npm test` — Vitest

## Deploy to Cloudflare (Workers static assets via GitHub)

SPA routing is configured in `wrangler.jsonc` with `assets.not_found_handling: "single-page-application"`.
Do **not** add a catch-all `_redirects` rule like `/* /index.html 200` — Cloudflare rejects it as an infinite loop.

1. Push this project to a GitHub repository (the repo root should be this project).
2. In **Cloudflare Dashboard → Workers & Pages → Create → Connect to Git**, select the repo (Workers Builds).
3. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** project root (no subdirectory)
4. Add environment variables (`VITE_FIREBASE_*`) under **Settings → Variables and Secrets** for Production (and Preview if needed).
5. Deploy. Unknown paths are served from `dist/index.html` by the Wrangler SPA setting.

### Custom domain `mystocks.ravikloyi.in`
1. In the Worker project → **Settings → Domains & Routes → Add → Custom domain** → enter `mystocks.ravikloyi.in`.
2. If `ravikloyi.in` is already on Cloudflare, DNS is configured automatically; otherwise add the CNAME/records Cloudflare provides at your DNS provider.
3. Wait for DNS/SSL to become active.

## Firestore

Reads `rupeefarm/board_latest` (overwritten by RupeeFarm backend on each board update). Ensure Firestore rules allow client read of this document and deny client writes. The Firebase **Authorized domains** list should include `mystocks.ravikloyi.in` and your `*.pages.dev` domain if needed.
