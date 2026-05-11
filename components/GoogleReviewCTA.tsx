/**
 * "Lämna recension på Google" CTA.
 *
 * Activates as soon as NEXT_PUBLIC_GOOGLE_REVIEW_URL is set in Vercel
 * env vars. Until then the section renders an explanatory placeholder
 * pointing customers at the phone/email so we still capture the
 * intent without an empty button.
 *
 * The URL should be the "write a review" deep link Google generates
 * once the Business Profile is verified — looks like
 *   https://g.page/r/<PROFILE_ID>/review
 * or the older
 *   https://search.google.com/local/writereview?placeid=<PLACE_ID>
 */

const REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;

const STARS = "★★★★★";

export function GoogleReviewCTA() {
  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
          <GoogleG />
          Recension på Google
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
          Nöjd med oss? Lämna gärna en recension.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
          Recensioner på Google hjälper nya kunder hitta oss och avgör vår
          plats i sökresultaten. Det tar 30 sekunder och betyder mycket
          för ett litet familjeföretag som vårt.
        </p>

        <div className="flex flex-wrap gap-3 justify-center items-center">
          {REVIEW_URL ? (
            <a
              href={REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 font-bold text-sm transition-colors shadow-sm"
            >
              <GoogleG />
              Skriv recension på Google
              <span className="text-amber-400 text-base">{STARS}</span>
            </a>
          ) : (
            <a
              href="tel:017121002"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              📞 Ring oss på 0171-210 02
            </a>
          )}
          <a
            href="mailto:info@bilskrotscentralen.com?subject=Recension%20%E2%80%94%20Bilskrotscentralen"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm transition-colors"
          >
            ✉️ Mejla din recension
          </a>
        </div>

        {!REVIEW_URL && (
          <p className="text-xs text-slate-400 mt-5">
            Vår Google-företagsprofil aktiveras inom kort. Mejla oss
            recensionen så lägger vi upp den när profilen är klar.
          </p>
        )}
      </div>
    </section>
  );
}

function GoogleG() {
  // Multi-color "G" so the button reads as Google without an image dep.
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
    </svg>
  );
}
