import { useState } from "react";
import Badge from "../components/Badge";
import Btn   from "../components/Btn";
import Empty from "../components/Empty";
import { today } from "../core/data";

const FILTERS = ["Tous", "Actifs", "Retournés", "En retard"];

// ── Transactions section ──────────────────────────
export default function Transactions({ state, dispatch }) {
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  const visible = state.transactions
    .filter((t) => {
      const user     = state.users.find((u) => u.id === t.userId);
      const book     = state.books.find((b) => b.id === t.bookId);
      const q        = search.toLowerCase();
      const matchQ   = user?.name.toLowerCase().includes(q) || book?.title.toLowerCase().includes(q);
      const isOverdue = t.overdue || (!t.returnDate && t.dueDate < today());

      const matchF =
        filter === "Tous"      ||
        (filter === "Actifs"    && !t.returnDate) ||
        (filter === "Retournés" &&  t.returnDate) ||
        (filter === "En retard" &&  isOverdue);

      return matchQ && matchF;
    })
    .reverse();

  return (
    <div className="animate-slide">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900 }}>
          Transactions
        </h2>
        <p style={{ color: "var(--sepia)", fontSize: 13, marginTop: 4 }}>
          {state.transactions.length} enregistrements au total
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Rechercher utilisateur ou livre…"
          style={{ flex: "1 1 200px", maxWidth: 320 }}
        />

        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:      "8px 16px",
              borderRadius: 6,
              border:       "1.5px solid",
              fontSize:     12,
              fontWeight:   600,
              borderColor:  filter === f ? "var(--ink)" : "var(--warm)",
              background:   filter === f ? "var(--ink)" : "transparent",
              color:        filter === f ? "var(--paper)" : "var(--sepia)",
              cursor:       "pointer",
              transition:   "all .15s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <Empty icon="📋" text="Aucune transaction trouvée" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.map((t) => {
            const user      = state.users.find((u) => u.id === t.userId);
            const book      = state.books.find((b) => b.id === t.bookId);
            const isOverdue = t.overdue || (!t.returnDate && t.dueDate < today());

            const borderColor = t.returnDate
              ? "var(--sage)"
              : isOverdue
              ? "var(--rust)"
              : "var(--blue)";

            return (
              <div
                key={t.id}
                style={{
                  background:   "#fff",
                  borderRadius: 10,
                  padding:      "16px 20px",
                  border:       `1px solid ${isOverdue && !t.returnDate ? "#f0c0c0" : "var(--cream)"}`,
                  boxShadow:    "0 2px 8px var(--shadow)",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          16,
                  flexWrap:     "wrap",
                  borderLeft:   `4px solid ${borderColor}`,
                }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {book?.title || "[supprimé]"}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize:   11,
                      color:      "var(--sepia)",
                      marginTop:  3,
                    }}
                  >
                    {user?.name || "[supprimé]"} · {t.borrowDate} → {t.returnDate || t.dueDate}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize:   10,
                      color:      "var(--warm)",
                      marginTop:  2,
                    }}
                  >
                    #{t.id}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge color={borderColor}>
                    {t.returnDate ? "Retourné" : isOverdue ? "En retard" : "Actif"}
                  </Badge>

                  {!t.returnDate && (
                    <Btn
                      small
                      variant="success"
                      onClick={() => dispatch({ type: "RETURN", txId: t.id })}
                    >
                      Retourner
                    </Btn>
                  )}

                  {!t.returnDate && !t.overdue && (
                    <Btn
                      small
                      variant="danger"
                      onClick={() => dispatch({ type: "MARK_OVERDUE", txId: t.id })}
                    >
                      Marquer retard
                    </Btn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
