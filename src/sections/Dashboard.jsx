import Badge from "../components/Badge";
import Empty from "../components/Empty";
import { today } from "../core/data";
import { GENRE_COLORS } from "../core/data";

// ── Dashboard — overview & stats ─────────────────
export default function Dashboard({ state }) {
  const { users, books, transactions } = state;
  const active  = transactions.filter((t) => !t.returnDate);
  const overdue = active.filter((t) => t.overdue || t.dueDate < today());
  const avail   = books.filter((b) => b.available);

  const stats = [
    { label: "Utilisateurs",       value: users.length,                                    icon: "👥", color: "var(--ink)" },
    { label: "Livres au catalogue", value: books.length,                                   icon: "📚", color: "var(--sage)" },
    { label: "Emprunts actifs",    value: active.length,                                   icon: "📖", color: "var(--blue)" },
    { label: "Disponibles",        value: avail.length,                                    icon: "✅", color: "var(--gold)" },
    { label: "En retard",          value: overdue.length,                                  icon: "⚠️", color: "var(--rust)" },
    { label: "Retournés",          value: transactions.filter((t) => t.returnDate).length, icon: "↩️", color: "var(--sepia)" },
  ];

  // Genre distribution
  const genreCounts = books.reduce((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-slide">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900 }}>
          Dashboard
        </h2>
        <p style={{ color: "var(--sepia)", fontSize: 13, marginTop: 4 }}>
          Vue d'ensemble de la bibliothèque
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
          gap:                 14,
          marginBottom:        32,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background:   "#fff",
              borderRadius: 12,
              padding:      "20px 22px",
              border:       "1px solid var(--cream)",
              boxShadow:    "0 2px 12px var(--shadow)",
              display:      "flex",
              flexDirection: "column",
              gap:           6,
            }}
          >
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize:   34,
                fontWeight: 900,
                color:      s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </span>
            <span style={{ fontSize: 12, color: "var(--sepia)", fontWeight: 500 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div
          style={{
            background:   "#fef5f5",
            border:       "1.5px solid #f0c0c0",
            borderRadius: 10,
            padding:      "16px 20px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontWeight:   700,
              color:        "var(--rust)",
              marginBottom: 10,
              display:      "flex",
              alignItems:   "center",
              gap:          8,
            }}
          >
            ⚠ Alertes de retard ({overdue.length})
          </div>
          {overdue.map((t) => {
            const user = users.find((u) => u.id === t.userId);
            const book = books.find((b) => b.id === t.bookId);
            return (
              <div
                key={t.id}
                style={{
                  fontSize:   13,
                  color:      "var(--rust)",
                  padding:    "4px 0",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {user?.name} → "{book?.title}" (dû le {t.dueDate})
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent transactions */}
        <div
          style={{
            background:   "#fff",
            borderRadius: 12,
            padding:      "20px",
            border:       "1px solid var(--cream)",
          }}
        >
          <div
            style={{
              fontFamily:   "'Playfair Display', serif",
              fontSize:     16,
              fontWeight:   700,
              marginBottom: 14,
            }}
          >
            Transactions récentes
          </div>
          {transactions.length === 0 ? (
            <Empty icon="📋" text="Aucune transaction" />
          ) : (
            [...transactions]
              .reverse()
              .slice(0, 5)
              .map((t) => {
                const user = users.find((u) => u.id === t.userId);
                const book = books.find((b) => b.id === t.bookId);
                const isOverdue = t.overdue || (!t.returnDate && t.dueDate < today());
                return (
                  <div
                    key={t.id}
                    style={{
                      display:        "flex",
                      justifyContent: "space-between",
                      alignItems:     "center",
                      padding:        "8px 0",
                      borderBottom:   "1px solid var(--cream)",
                      fontSize:       12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{book?.title}</div>
                      <div style={{ color: "var(--sepia)", fontFamily: "'DM Mono', monospace" }}>
                        {user?.name}
                      </div>
                    </div>
                    <Badge
                      color={
                        t.returnDate ? "var(--sage)" : isOverdue ? "var(--rust)" : "var(--blue)"
                      }
                    >
                      {t.returnDate ? "retourné" : isOverdue ? "retard" : "actif"}
                    </Badge>
                  </div>
                );
              })
          )}
        </div>

        {/* Genre distribution */}
        <div
          style={{
            background:   "#fff",
            borderRadius: 12,
            padding:      "20px",
            border:       "1px solid var(--cream)",
          }}
        >
          <div
            style={{
              fontFamily:   "'Playfair Display', serif",
              fontSize:     16,
              fontWeight:   700,
              marginBottom: 14,
            }}
          >
            Genres
          </div>
          {Object.entries(genreCounts).map(([genre, count]) => (
            <div key={genre} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  fontSize:       12,
                  marginBottom:   4,
                }}
              >
                <span style={{ fontWeight: 500 }}>{genre}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--sepia)" }}>
                  {count}
                </span>
              </div>
              <div
                style={{
                  height:       6,
                  background:   "var(--cream)",
                  borderRadius: 3,
                  overflow:     "hidden",
                }}
              >
                <div
                  style={{
                    height:       "100%",
                    width:        `${(count / books.length) * 100}%`,
                    background:   GENRE_COLORS[genre] || "var(--gold)",
                    borderRadius: 3,
                    transition:   "width .5s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
