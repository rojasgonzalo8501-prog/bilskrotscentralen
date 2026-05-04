"use client";

import { useEffect } from "react";

/**
 * Forces the .light class on <html> for the preview route, then
 * cleans up on unmount so the rest of the site keeps its persisted
 * dark theme. Used only on /preview-startsida.
 */
export function ForceLightTheme() {
  useEffect(() => {
    const had = document.documentElement.classList.contains("light");
    if (!had) document.documentElement.classList.add("light");
    return () => {
      // Restore based on persisted preference, not the value we set
      if (localStorage.getItem("theme") !== "light") {
        document.documentElement.classList.remove("light");
      }
    };
  }, []);
  return null;
}
