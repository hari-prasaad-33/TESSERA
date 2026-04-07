# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment variables

Set these in **Vercel** (Production / Preview) for the live site.

- `FORMSPREE_FORM_ID` (optional): Formspree form id for Early Believers (defaults to the id baked into the repo if unset). Used by `/api/early-believer`.
- `RESEND_API_KEY` (required for automated thank-you email): used by `/api/thank-you`.
- `RESEND_FROM` (optional): e.g. `Tessera Audio <hari@tesseraaudio.com>`. Requires a verified sending domain in Resend.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (optional): [Upstash Redis](https://upstash.com/) REST credentials. When set, `/api/early-believer` remembers signed-up emails server-side and responds with **already signed up** instead of creating duplicate Formspree rows. Without these, the form still works but cannot detect repeat emails across visits.

Local dev-only: `VITE_FORMSPREE_ID` is unused by Early Believers now (signups go through `/api/early-believer`).

### Thank-you email not arriving

1. **Vercel → Settings → Environment Variables:** confirm `RESEND_API_KEY` is set for **Production** (and redeploy after adding it).
2. **`RESEND_FROM`:** If you set `Tessera Audio <hari@tesseraaudio.com>`, the domain must be **verified in Resend**. Until then, omit `RESEND_FROM` so the app uses Resend’s test sender (`onboarding@resend.dev`). On the free tier you can often only send **to your own verified address** until the domain is verified—check [Resend dashboard](https://resend.com) → Logs for bounces or errors.
3. **Spam / Promotions:** Check those folders for the recipient address.
4. **Vercel Root Directory:** The project root should be the **`website`** folder (or equivalent) so `api/early-believer.js` and `api/thank-you.js` deploy as serverless functions. If the root is the repo root with no `api/` there, `/api/*` may 404 and the live site may fall back to browser-only Formspree (no thank-you).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
