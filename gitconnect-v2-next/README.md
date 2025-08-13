## GitConnect (Open Source)

This is the open-source version of GitConnect, a Next.js + Firebase project for building developer portfolios from GitHub data.

### Quickstart
- Node 18+
- Copy `.env.example` to `.env.local` and fill required keys.
- `pnpm i` (or npm/yarn) then `pnpm dev` to start.

### Security/Config Defaults
- Payments (Stripe) and analytics (Mixpanel) are disabled by default via env flags.
- No client-side revalidation; server revalidation requires `REVALIDATION_TOKEN`.
- OpenAI usage must happen via server API routes; no keys in the browser.

### Optional Integrations
- Firebase Admin: set `FIREBASE_ADMIN_*` server envs.
- Weaviate: set `WCD_URL`, `WCD_API_KEY`, and `OPENAI_WEAVIATE_APIKEY` to enable AI features.

### Contributing
Please see `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

### Security
Please see `SECURITY.md` for how to report vulnerabilities.

### License
MIT
