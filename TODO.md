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
- [x] **2FA for admin users** (TOTP via in-house RFC 6238 implementation
      in `lib/totp.ts` — uses Node's `crypto`, no npm dependency).
      Schema: User gets totpSecret, totpEnabled, totpVerifiedAt
      (migration 20260507100000_add_totp). Login flow: when password is
      OK and totpEnabled, set short-lived `merca_pending_2fa` cookie
      and redirect to `/logga-in/2fa` for the 6-digit challenge.
      Self-enrollment + disable at `/admin/sakerhet` with QR code.

## 🖼 Sprint 3 — Performance & mobile (1.5 days)

- [x] **Migrate `<img>` → `<Image>`** on the high-impact paths:
      HomeHero photo background (priority + sizes=100vw),
      FeaturedPartCard, homepage Mercedes-grid + category cards +
      brand grid + verkstad highlight image. Smaller decorative
      `<img>`s in admin / less-trafficked routes left for a follow-up.
- [x] **ISR on homepage and /mercedes** — `revalidate = 60` instead
      of `force-dynamic`. Gives near-static TTFB with at-most-60s
      staleness on featured parts. Category/brand listings kept
      dynamic since they take filter searchParams.
- [x] **Sticky "Lägg i varukorg" bar on mobile** on `/bildelar/[slug]`
      via new `StickyAddToCart` component. IntersectionObserver tied
      to a sentinel near the desktop CTA reveals the bar only after
      the user scrolls past it; hidden on sm+. Handles all three
      states (available, in cart, price-on-request).
- [ ] **Lazy-load below-the-fold sections** on the homepage.

## 🌐 Sprint 4 — Public-site UX & conversion

- [x] **Search in the header** — replaced the placeholder Link with a
      real `<form action="/bildelar" method="get">` containing a search
      input that submits ?q=… directly. Mobile menu gets the same
      input. /bildelar already does case-insensitive contains across
      name + SKU + OE number, so this turns "click → page → type" into
      "type from anywhere". Standalone `/sök` route deferred — not
      enough additional value over /bildelar?q=.
- [ ] **Order tracking without login** at `/spara-order/[orderNumber]`
      Tokenised link from confirmation email; no account required.
- [ ] **Wishlist / "Spara delar"** for logged-in users + email reminders.
- [ ] **Customer reviews per part** — email 14d after DELIVERED.
- [x] **Honeypot on /eftersok** — hidden field `company_url` that real
      users can't see (tabIndex=-1, off-screen, aria-hidden). Server
      action drops submissions where it's filled in and returns a
      fake success so spammers don't retry. Cloudflare Turnstile is
      still on the table for tougher bots, but this kills 90% of basic
      spam without an external dep.
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
