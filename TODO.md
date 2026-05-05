# Bilskrotscentralen — Roadmap & TODO

Living document. Tick off items as they ship; add new ones on top of the
relevant section. PR description should reference the row(s) it closes.

> **Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked / needs decision

---

## 🚀 Sprint 1 — Observability (today)

- [x] **Sentry — error tracking** (DSN hardcoded as default in
      sentry.{client,server,edge}.config.ts; EU region project active)
- [ ] **Sentry source maps** — needs `SENTRY_AUTH_TOKEN` + org/project
      env vars in Vercel for symbolicated stack traces in production.
- [ ] **Plausible — privacy-first analytics**
      Component is wired in layout; needs `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
      env var set in Vercel after plausible.io account is created.
- [ ] **Document env vars** in `README` so the next dev knows what's wired.

## 🧭 Sprint 2 — Admin productivity (3 days)

- [x] **KPI dashboard** at `/admin`
      Today's revenue + order count, MTD revenue, stock value, orders to
      pack, pending payments, dead stock >180d, cars in dismantling, recent
      orders with status pills. Förfrågningar count is stubbed at 0
      until the Lead model lands.
- [x] **Förfrågningar inbox** at `/admin/eftersok`
      Lead model added to schema (migration 20260505100000_add_leads).
      `/eftersok` form now persists to DB alongside the email send.
      Inbox lists with status tabs (Öppna/Nya/Pågår/Besvarade/Vunna/
      Förlorade/Alla) + search by name/email/SKU/regnr/free-text.
      Detail view at `/admin/eftersok/[id]` with status actions
      (Ta över, Pågår, Besvarad, Vunnen, Förlorad), threaded notes,
      and one-click "Öppna svar i e-post" mailto link prefilled with
      reply boilerplate. Dashboard counter ("Förfrågningar i kö")
      now reads NEW + IN_PROGRESS counts.
- [x] **Bulk actions on `/admin/delar`** — checkboxes per row + select-
      all on page; floating action bar with bulk status change
      (Tillgänglig/Reserverad/Såld/Dragen) and bulk price set (single
      shared price or "pris på förfrågan" by leaving the input empty).
      `bulkUpdateStatus` + `bulkUpdatePrice` server actions, admin-gated,
      cap of 500 rows per call. Bulk image upload deferred to a future
      pass — needs a media-upload pipeline first.
- [x] **CSV export** on parts, orders, customers, invoices, leads.
      `lib/csv.ts` builder with RFC 4180 escaping + UTF-8 BOM (Excel
      opens åäö correctly). `/api/admin/export/<resource>` route
      handler, admin/superadmin gated. Download buttons in each list
      page header.
- [ ] **Audit log model** + middleware that records every admin mutation
      with `userId`, `action`, `entityType`, `entityId`, `before`, `after`.
- [ ] **2FA for admin users** (TOTP via `otplib`).

## 🖼 Sprint 3 — Performance & mobile (1.5 days)

- [ ] **Migrate `<img>` → `<Image>`** across the codebase
      (~23 lint warnings to clear; biggest LCP wins on hero, category cards,
      part galleries).
- [ ] **ISR for part pages and category pages**
      Drop `force-dynamic` where it's not necessary — 60-second revalidate
      gives near-static performance with no stale risk.
- [ ] **Sticky "Lägg i varukorg" bar on mobile** on `/bildelar/[slug]`
      so the CTA never scrolls out of view.
- [ ] **Lazy-load below-the-fold sections** on the homepage.

## 🌐 Sprint 4 — Public-site UX & conversion

- [ ] **Search page `/sök`**
      Real fulltext over SKU + name + OE-nr + brand + model.
- [ ] **Order tracking without login** at `/spara-order/[orderNumber]`
      Tokenised link from confirmation email; no account required.
- [ ] **Wishlist / "Spara delar"** for logged-in users + email reminders.
- [ ] **Customer reviews per part** — email 14d after DELIVERED.
- [ ] **CAPTCHA / honeypot on all public forms** (Cloudflare Turnstile).
- [ ] **Compare mode** — pick 2–3 alternative SKUs side-by-side.

## 🧾 Sprint 5 — Customer portal `/konto`

- [ ] **"Köp igen"** button on past orders.
- [ ] **Invoice / receipt PDF download** in order detail.
- [ ] **Order status timeline** (Beställd → Betald → Packad → Skickad → Levererad).
- [ ] **Email verification on signup** + **password reset flow**.
- [ ] **GDPR self-service** — export my data + delete my account.
- [ ] **Save fitment** — "min bil = W212 2014" filters parts automatically.
- [ ] **Garanti / claim form** with photo upload.

## 🛡 Sprint 6 — Security & ops

- [ ] **Rate limiting** on `/api/auth` and form server actions (Upstash Redis).
- [ ] **Daily DB backups** to S3.
- [ ] **Email deliverability** — SPF, DKIM, DMARC for `bilskrotscentralen.com`.
- [ ] **E2E tests** for checkout (Playwright) — Nets payment happy path
      + at least one failure path.
- [ ] **Uptime monitor** (UptimeRobot or Better Stack — free tier).

## 📈 Sprint 7 — Marketing & B2B

- [x] **Google Analytics 4** — measurement ID G-Y14NBBQ8NL hardcoded
      as default in components/Analytics.tsx; overridable via
      NEXT_PUBLIC_GA_ID. gtag.js loader is shared with Google Ads.
- [ ] **Activate Meta Pixel + Google Ads tag**
      Already scaffolded in `components/Analytics.tsx` — needs IDs.
- [ ] **Real Trustpilot integration**
      Swap `data/testimonials` for live API once business unit is live.
- [ ] **B2B portal** with `WORKSHOP` UserRole + `priceSekB2B` per part
      (Phase 3 from the original homepage redesign plan — separate session,
      involves Prisma migration).

---

## ✅ Done

- [x] Homepage redesign live (split hero, TrustStrip, Mercedes grid, etc.)
- [x] Whole site flipped to light theme
- [x] Brand favicon + square logo for Google Knowledge Graph
- [x] Tawk live chat (embedded)
- [x] Pris-förfrågan flow separated from chat → reuses `/eftersok` form
- [x] WhatsApp inquiry CTAs migrated to chat / inquiry flow
- [x] Stock urgency badge ("Endast 1 kvar") on featured parts
- [x] Auto-rotating testimonial carousel on homepage
- [x] `/guider` knowledge base with 3 SEO articles
- [x] `/omdomen` reviews page
- [x] Verkstad highlight section on homepage
- [x] Hero photo background with depth (orange + emerald glows)
- [x] Scrap-premium can bottom out at 0 kr
- [x] Official Swish SVG; PostNord + DHL on consistent white pills
- [x] Klarna swapped for Swish on the homepage TrustStrip
- [x] Metallinköp removed (moving to its own brand: Ransona Metall)
