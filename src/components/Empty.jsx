// ── Empty — placeholder when a list is empty ─────
export default function Empty({ icon, text }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding:   "48px 20px",
        color:     "var(--sepia)",
        opacity:   0.7,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{text}</div>
    </div>
  );
}
