import { today } from "../core/data";

const TABS = [
  { id: "dashboard",    label: "Dashboard",     icon: "◈" },
  { id: "users",        label: "Utilisateurs",  icon: "◉" },
  { id: "books",        label: "Catalogue",     icon: "◫" },
  { id: "transactions", label: "Transactions",  icon: "◌" },
];

// ── Sidebar — dark navigation panel ──────────────
export default function Sidebar({ tab, setTab, state }) {
  const overdueCount = state.transactions.filter(
    (t) => !t.returnDate && (t.overdue || t.dueDate < today())
  ).length;

  return (
    <div
      style={{
        width:          220,
        flexShrink:     0,
        background:     "var(--ink)",
        color:          "var(--paper)",
        display:        "flex",
        flexDirection:  "column",
        minHeight:      "100vh",
        position:       "sticky",
        top:            0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding:      "28px 24px 22px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>📚</div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize:   20,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Library
          <br />
          System
        </div>
        <div
          style={{
            fontFamily:    "'DM Mono', monospace",
            fontSize:      10,
            color:         "rgba(255,255,255,.3)",
            marginTop:     6,
            letterSpacing: 1,
          }}
        >
          MANAGEMENT · v2.0
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge  = t.id === "transactions" && overdueCount > 0 ? overdueCount : null;

          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                width:       "100%",
                display:     "flex",
                alignItems:  "center",
                gap:         12,
                padding:     "11px 14px",
                borderRadius: 8,
                border:      "none",
                background:  active ? "rgba(201,168,76,.18)" : "transparent",
                color:       active ? "var(--gold)" : "rgba(255,255,255,.55)",
                fontFamily:  "'DM Sans', sans-serif",
                fontSize:    13,
                fontWeight:  active ? 600 : 400,
                cursor:      "pointer",
                textAlign:   "left",
                marginBottom: 2,
                borderLeft:  active ? "3px solid var(--gold)" : "3px solid transparent",
                transition:  "all .15s",
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {badge && (
                <span
                  style={{
                    background:   "var(--rust)",
                    color:        "#fff",
                    borderRadius: 20,
                    fontSize:     10,
                    fontWeight:   700,
                    padding:      "1px 7px",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Quick stats footer ── */}
      <div
        style={{
          padding:      "16px 20px",
          borderTop:    "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            fontSize:      11,
            color:         "rgba(255,255,255,.3)",
            marginBottom:  8,
            letterSpacing: .8,
          }}
        >
          STATS RAPIDES
        </div>
        {[
          { l: "Utilisateurs", v: state.users.length },
          { l: "Livres",       v: state.books.length },
          { l: "Actifs",       v: state.transactions.filter((t) => !t.returnDate).length },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              display:        "flex",
              justifyContent: "space-between",
              fontSize:       12,
              padding:        "3px 0",
              color:          "rgba(255,255,255,.5)",
            }}
          >
            <span>{s.l}</span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                color:      "rgba(255,255,255,.75)",
              }}
            >
              {s.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
