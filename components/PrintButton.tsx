"use client";

/**
 * "Skriv ut / spara som PDF" — opens the browser's native print
 * dialog. From there the user picks "Save as PDF" or a real printer.
 *
 * Works on every desktop browser and iOS/Android Safari/Chrome.
 * No PDF lib needed — the browser does it for free.
 */

interface Props {
  /** Optional document title hint shown in the print preview header. */
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PrintButton({ className, children, title }: Props) {
  function print() {
    if (typeof window === "undefined") return;
    if (title) {
      const original = document.title;
      document.title = title;
      window.print();
      // Restore after the dialog closes — most browsers fire afterprint.
      const restore = () => {
        document.title = original;
        window.removeEventListener("afterprint", restore);
      };
      window.addEventListener("afterprint", restore);
    } else {
      window.print();
    }
  }

  return (
    <button
      type="button"
      onClick={print}
      className={
        className ??
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-bold transition-colors"
      }
    >
      🖨️ {children ?? "Skriv ut / spara som PDF"}
    </button>
  );
}
