import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "var(--color-dark)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 20vw, 14rem)",
          lineHeight: 1,
          letterSpacing: "0.04em",
          color: "transparent",
          WebkitTextStroke: "2px var(--color-cu)",
          userSelect: "none",
        }}
      >
        404
      </div>

      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
          color: "var(--color-cu)",
          margin: "1rem 0 2rem",
        }}
      >
        Den här sidan finns inte.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn-cu">
          Till startsidan
        </Link>
        <Link href="/skrota" className="btn-ghost">
          Boka skrotning
        </Link>
      </div>
    </section>
  );
}
