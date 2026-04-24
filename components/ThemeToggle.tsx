"use client";

import { useEffect, useState } from "react";

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.add("light");
  }
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    applyTheme(dark);
  }, [dark]);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Byt tema"
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--color-dark-500)] bg-[var(--color-dark-700)] hover:border-[var(--color-brand-orange)] transition-colors text-base"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
