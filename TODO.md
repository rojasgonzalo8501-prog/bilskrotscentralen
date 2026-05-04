# Bilskrotscentralen — Roadmap & TODO

Living document. Tick off items as they ship; add new ones on top of the
relevant section. PR description should reference the row(s) it closes.

> **Legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked / needs decision

---

## 🚀 Sprint 1 — Observability (today)

- [ ] **Sentry — error tracking**
      Install `@sentry/nextjs`, scaffold client + server + edge configs.
      Wire to `NEXT_PUBLIC_SENTRY_DSN` env var so it's a no-op until set.
      ▸ External: create Sentry project, paste DSN in Vercel env.
- [ ] **Plausible — privacy-first analytics**
      Drop the script in `<head>` gated by `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
      Same no-op-until-set pattern.
      ▸ External: sign up at plausible.io (or self-host) and add the domain.
- [ ] **Document env vars** in `README` so the next dev knows what's wired.

## 🧭 Sprint 2 — Admin productivity (3 days)

- [ ] **KPI dashboard** at `/admin`
      Today's orders, revenue MTD, parts to pack, eftersok awaiting reply,
      stock value, dead stock (>180d unsold), oldest pending order.
- [ ] **Förfrågningar inbox** at `/admin/eftersok`
      Pull eftersok rows from DB (need a Lead model — schema migration).
      One-click "Reply with price" → opens email draft prefilled with part
      + suggested price from similar SKUs.
- [ ] **Bulk actions on `/admin/delar`**
      Select rows → bulk price update / bulk status change / bulk image
      upload. Adam stops clicking through 50 SKUs one by one.
- [ ] **CSV export** on parts, orders, customers, invoices.
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
