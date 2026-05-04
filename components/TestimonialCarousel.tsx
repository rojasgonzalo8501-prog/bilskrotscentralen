"use client";

/**
 * TestimonialCarousel — auto-rotating customer reviews on the homepage.
 *
 * Plays one card at a time, advances every 6s, pauses on hover. Dots
 * are clickable. When a real Trustpilot account is connected the same
 * markup can render fetched reviews — only the data source needs to
 * change.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type Testimonial = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: string;
  location?: string;
};

const ROTATE_MS = 6000;

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(advance, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [advance, paused]);

  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Kundomdömen"
    >
      <div className="flex items-start gap-3 mb-3 min-h-[140px]">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-500 font-bold">
          {current.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-0.5 text-amber-400 text-sm mb-1" aria-label={`${current.rating} av 5`}>
            {Array.from({ length: current.rating }).map((_, k) => (
              <span key={k}>★</span>
            ))}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            &ldquo;{current.text}&rdquo;
          </p>
          <div className="text-xs text-slate-500 mt-2">
            <strong className="text-slate-700">{current.author}</strong>
            {current.location && ` · ${current.location}`}
            {" · "}
            {current.source}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 pt-2">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setIndex(i)}
            aria-label={`Visa omdöme ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
