// ── Modal — centered overlay dialog ──────────────
export default function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         500,
        background:     "rgba(26,18,8,.45)",
        backdropFilter: "blur(4px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        animation:      "fadeIn .2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background:   "var(--paper)",
          borderRadius: 14,
          padding:      "28px 32px",
          width:        "min(480px, 94vw)",
          boxShadow:    "0 24px 80px var(--shadow-lg)",
          animation:    "slideIn .22s ease",
          border:       "1px solid var(--warm)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            marginBottom:   22,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize:   20,
              fontWeight: 700,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontSize:   22,
              color:      "var(--sepia)",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
