// ── Btn — multi-variant button ───────────────────
const VARIANTS = {
  primary: { bg: "var(--ink)",     color: "var(--paper)", border: "none" },
  ghost:   { bg: "transparent",   color: "var(--sepia)", border: "1.5px solid var(--warm)" },
  danger:  { bg: "transparent",   color: "var(--rust)",  border: "1.5px solid rgba(192,57,43,.35)" },
  success: { bg: "var(--sage)",   color: "#fff",         border: "none" },
  gold:    { bg: "var(--gold)",   color: "var(--ink)",   border: "none" },
};

export default function Btn({
  children,
  onClick,
  variant = "primary",
  small = false,
  disabled = false,
  style = {},
}) {
  const s = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:   s.bg,
        color:        s.color,
        border:       s.border,
        borderRadius: 6,
        padding:      small ? "5px 12px" : "8px 18px",
        fontSize:     small ? 12 : 13,
        fontWeight:   600,
        letterSpacing: 0.3,
        opacity:      disabled ? 0.45 : 1,
        transition:   "all .15s",
        cursor:       disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
