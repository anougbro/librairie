// ── Field — labelled form wrapper ────────────────
export default function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize:      11,
          fontWeight:    600,
          color:         "var(--sepia)",
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
