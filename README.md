# my-stocks

Live stock board UI for RupeeFarm, built with React + TypeScript + Vite + Tailwind and Firebase Firestore.

- **Title:** Stocks (₹)
- **Live data:** Firestore `rupeefarm/board_latest` (read-only, realtime via `onSnapshot`)
- **Hosting target:** `rupeefarm.ravikloyi.in` (Cloudflare Pages via GitHub)

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

## Deploy to Cloudflare Pages (via GitHub)

1. Push this project to a GitHub repository (if `my-stocks` is the repo root, use it as-is; if it lives inside a larger repo, set the Pages **Root directory** to `my-stocks`).
2. In **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**, select the repo.
3. Build settings:
   - **Framework preset:** Vite (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `my-stocks` (only if applicable)
4. Add environment variables (`VITE_FIREBASE_*`) under **Settings → Environment variables**.
5. Deploy. SPA routing is handled by `public/_redirects` (`/* /index.html 200`).

### Custom domain `rupeefarm.ravikloyi.in`
1. In the Cloudflare Pages project → **Custom domains → Set up a custom domain** → enter `rupeefarm.ravikloyi.in`.
2. If `ravikloyi.in` is already on Cloudflare, DNS is configured automatically; otherwise add the CNAME/records Cloudflare provides at your DNS provider.
3. Wait for DNS/SSL to become active.

## Firestore

Reads `rupeefarm/board_latest` (overwritten by RupeeFarm backend on each board update). Ensure Firestore rules allow client read of this document and deny client writes. The Firebase **Authorized domains** list should include `rupeefarm.ravikloyi.in` and your `*.pages.dev` domain if needed.
