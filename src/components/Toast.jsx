import { useEffect } from "react";

const COLORS = { ok: "var(--sage)", err: "var(--rust)", warn: "var(--gold)" };
const ICONS  = { ok: "✓",          err: "✕",           warn: "⚠" };

// ── Toast — bottom-right notification ────────────
export default function Toast({ toast, dispatch }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 3200);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div
      style={{
        position:    "fixed",
        bottom:      24,
        right:       24,
        zIndex:      9999,
        background:  "var(--ink)",
        color:       "var(--paper)",
        borderRadius: 10,
        padding:     "12px 20px",
        display:     "flex",
        alignItems:  "center",
        gap:         10,
        boxShadow:   "0 8px 32px var(--shadow-lg)",
        animation:   "slideIn .25s ease",
        fontFamily:  "'DM Sans', sans-serif",
        fontSize:    14,
        borderLeft:  `4px solid ${COLORS[toast.kind]}`,
        maxWidth:    320,
      }}
    >
      <span style={{ color: COLORS[toast.kind], fontWeight: 700, fontSize: 16 }}>
        {ICONS[toast.kind]}
      </span>
      {toast.msg}
    </div>
  );
}
