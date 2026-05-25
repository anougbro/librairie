import { useState } from "react";
import Badge  from "../components/Badge";
import Btn    from "../components/Btn";
import Empty  from "../components/Empty";
import Field  from "../components/Field";
import Modal  from "../components/Modal";
import { GENRES, GENRE_COLORS, GENRE_ICONS } from "../core/data";

// ── Add Book modal ────────────────────────────────
function AddBookModal({ onClose, dispatch }) {
  const [title,  setTitle]  = useState("");
  const [author, setAuthor] = useState("");
  const [isbn,   setIsbn]   = useState("");
  const [genre,  setGenre]  = useState("Engineering");

  const submit = () => {
    if (!title.trim() || !author.trim()) return;
    dispatch({
      type:   "ADD_BOOK",
      title:  title.trim(),
      author: author.trim(),
      isbn:   isbn.trim() || "N/A",
      genre,
    });
    onClose();
  };

  return (
    <Modal title="Ajouter un livre" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Titre">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du livre" />
        </Field>
        <Field label="Auteur">
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nom de l'auteur" />
        </Field>
        <Field label="ISBN">
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-…" />
        </Field>
        <Field label="Genre">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Btn onClick={submit}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

// ── Borrow Book modal ─────────────────────────────
function BorrowModal({ book, users, onClose, dispatch }) {
  const [userId, setUserId] = useState("");

  const submit = () => {
    if (!userId) return;
    dispatch({ type: "BORROW", userId, bookId: book.id });
    onClose();
  };

  return (
    <Modal title={`Emprunter "${book.title}"`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Sélectionner un utilisateur">
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">— choisir —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </Field>
        <Btn onClick={submit} disabled={!userId}>
          Confirmer l'emprunt
        </Btn>
      </div>
    </Modal>
  );
}

// ── Books section ─────────────────────────────────
export default function Books({ state, dispatch }) {
  const [showAdd,     setShowAdd]     = useState(false);
  const [borrowBook,  setBorrowBook]  = useState(null);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");

  const visible = state.books.filter((b) => {
    const q      = search.toLowerCase();
    const matchQ =
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q);
    const matchF =
      filter === "All" ||
      (filter === "Disponible" && b.available) ||
      (filter === "Emprunté"   && !b.available) ||
      filter === b.genre;
    return matchQ && matchF;
  });

  return (
    <div className="animate-slide">
      {/* Header */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "flex-start",
          marginBottom:   24,
          flexWrap:       "wrap",
          gap:            12,
        }}
      >
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900 }}>
            Catalogue
          </h2>
          <p style={{ color: "var(--sepia)", fontSize: 13, marginTop: 4 }}>
            {state.books.length} livres · {state.books.filter((b) => b.available).length} disponibles
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Ajouter</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Titre, auteur, ISBN…"
          style={{ flex: "1 1 220px", maxWidth: 320 }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: "0 0 auto", width: "auto" }}
        >
          <option value="All">Tous</option>
          <option value="Disponible">Disponible</option>
          <option value="Emprunté">Emprunté</option>
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* Book grid */}
      {visible.length === 0 ? (
        <Empty icon="📚" text="Aucun livre trouvé" />
      ) : (
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
            gap:                 14,
          }}
        >
          {visible.map((b) => {
            const gc       = GENRE_COLORS[b.genre] || "var(--sepia)";
            const tx       = state.transactions.find((t) => t.bookId === b.id && !t.returnDate);
            const borrower = tx ? state.users.find((u) => u.id === tx.userId) : null;

            return (
              <div
                key={b.id}
                style={{
                  background:    "#fff",
                  borderRadius:  12,
                  border:        "1px solid var(--cream)",
                  boxShadow:     "0 2px 10px var(--shadow)",
                  overflow:      "hidden",
                  display:       "flex",
                  flexDirection: "column",
                }}
              >
                {/* Genre color stripe */}
                <div style={{ height: 6, background: gc }} />

                <div
                  style={{
                    padding:       "16px 18px",
                    flex:          1,
                    display:       "flex",
                    flexDirection: "column",
                    gap:           10,
                  }}
                >
                  {/* Title + icon */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
                        {b.title}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--sepia)" }}>
                        {b.author}
                      </div>
                    </div>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{GENRE_ICONS[b.genre] || "📄"}</span>
                  </div>

                  {/* Badges */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge color={gc}>{b.genre}</Badge>
                    <Badge color={b.available ? "var(--sage)" : "var(--rust)"}>
                      {b.available ? "Disponible" : "Emprunté"}
                    </Badge>
                  </div>

                  {/* Borrower info */}
                  {borrower && (
                    <div
                      style={{
                        fontSize:     11,
                        color:        "var(--sepia)",
                        fontFamily:   "'DM Mono', monospace",
                        background:   "var(--cream)",
                        borderRadius: 6,
                        padding:      "6px 10px",
                      }}
                    >
                      Par {borrower.name} · retour le {tx.dueDate}
                    </div>
                  )}

                  {/* ISBN */}
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--warm)" }}>
                    {b.isbn}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    {b.available ? (
                      <Btn small variant="success" onClick={() => setBorrowBook(b)}>
                        Emprunter
                      </Btn>
                    ) : (
                      <Btn small variant="ghost" disabled>
                        Non disponible
                      </Btn>
                    )}
                    <Btn
                      small
                      variant="danger"
                      onClick={() => dispatch({ type: "REMOVE_BOOK", id: b.id })}
                    >
                      Supprimer
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} dispatch={dispatch} />}

      {borrowBook && (
        <BorrowModal
          book={borrowBook}
          users={state.users}
          onClose={() => setBorrowBook(null)}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
