// ── Badge — small colored label ──────────────────
export default function Badge({ children, color = "#4a7c59" }) {
  return (
    <span
      style={{
        display:     "inline-flex",
        alignItems:  "center",
        gap:         4,
        background:  color + "22",
        color,
        border:      `1px solid ${color}44`,
        borderRadius: 20,
        padding:     "2px 10px",
        fontSize:    11,
        fontWeight:  600,
        fontFamily:  "'DM Mono', monospace",
        whiteSpace:  "nowrap",
      }}
    >
      {children}
    </span>
  );
}
