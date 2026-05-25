import { useState } from "react";
import Badge   from "../components/Badge";
import Btn     from "../components/Btn";
import Empty   from "../components/Empty";
import Field   from "../components/Field";
import Modal   from "../components/Modal";
import { UserFactory } from "../core/UserFactory";

// ── Add User modal ────────────────────────────────
function AddUserModal({ onClose, dispatch }) {
  const [role,  setRole]  = useState("Student");
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [dept,  setDept]  = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim()) return;
    dispatch({
      type:  "ADD_USER",
      role,
      name:  name.trim(),
      email: email.trim(),
      extra: { department: dept || "General" },
    });
    onClose();
  };

  return (
    <Modal title="Ajouter un utilisateur" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Rôle">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {UserFactory.roles().map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="Nom complet">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Alice Mensah"
          />
        </Field>

        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex. alice@uni.edu"
          />
        </Field>

        {role === "Teacher" && (
          <Field label="Département">
            <input
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="ex. Informatique"
            />
          </Field>
        )}

        <Btn onClick={submit}>Ajouter</Btn>
      </div>
    </Modal>
  );
}

// ── Users section ─────────────────────────────────
export default function Users({ state, dispatch }) {
  const [showAdd,    setShowAdd]    = useState(false);
  const [search,     setSearch]     = useState("");
  const [notifUser,  setNotifUser]  = useState(null);

  const visible = state.users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

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
            Utilisateurs
          </h2>
          <p style={{ color: "var(--sepia)", fontSize: 13, marginTop: 4 }}>
            {state.users.length} membres inscrits
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)}>+ Ajouter</Btn>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍  Rechercher par nom ou email…"
        style={{ marginBottom: 20, maxWidth: 380 }}
      />

      {/* Grid */}
      {visible.length === 0 ? (
        <Empty icon="👤" text="Aucun utilisateur trouvé" />
      ) : (
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap:                 14,
          }}
        >
          {visible.map((u) => {
            const active     = state.transactions.filter((t) => t.userId === u.id && !t.returnDate).length;
            const roleColor  = u.role === "Teacher" ? "var(--gold)" : "var(--sage)";

            return (
              <div
                key={u.id}
                style={{
                  background:    "#fff",
                  borderRadius:  12,
                  padding:       "20px",
                  border:        "1px solid var(--cream)",
                  boxShadow:     "0 2px 10px var(--shadow)",
                  display:       "flex",
                  flexDirection: "column",
                  gap:           12,
                }}
              >
                {/* Avatar + name */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width:          42,
                        height:         42,
                        borderRadius:   "50%",
                        background:     roleColor + "22",
                        color:          roleColor,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontFamily:     "'Playfair Display', serif",
                        fontWeight:     900,
                        fontSize:       18,
                        border:         `2px solid ${roleColor}44`,
                        flexShrink:     0,
                      }}
                    >
                      {u.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--sepia)" }}>
                        {u.email}
                      </div>
                    </div>
                  </div>
                  <Badge color={roleColor}>{u.role}</Badge>
                </div>

                {/* Info badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Badge color="var(--sepia)">
                    Emprunts : {active}/{u.borrowLimit}
                  </Badge>
                  <Badge color="var(--sepia)">Durée : {u.loanDays}j</Badge>
                  {u.department && <Badge color="var(--purple)">{u.department}</Badge>}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Btn small variant="ghost" onClick={() => setNotifUser(u)}>
                    📬 {u.notifications.length} message{u.notifications.length !== 1 ? "s" : ""}
                  </Btn>
                  <Btn
                    small
                    variant="danger"
                    onClick={() => dispatch({ type: "REMOVE_USER", id: u.id })}
                  >
                    Supprimer
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} dispatch={dispatch} />}

      {notifUser && (
        <Modal title={`Boîte de réception — ${notifUser.name}`} onClose={() => setNotifUser(null)}>
          {notifUser.notifications.length === 0 ? (
            <Empty icon="📭" text="Aucun message" />
          ) : (
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                gap:           8,
                maxHeight:     340,
                overflowY:     "auto",
              }}
            >
              {[...notifUser.notifications].reverse().map((n) => (
                <div
                  key={n.id}
                  style={{
                    background:   "var(--cream)",
                    borderRadius: 8,
                    padding:      "10px 14px",
                    fontSize:     13,
                  }}
                >
                  <div
                    style={{
                      fontFamily:   "'DM Mono', monospace",
                      fontSize:     10,
                      color:        "var(--sepia)",
                      marginBottom: 4,
                    }}
                  >
                    {n.date}
                  </div>
                  {n.msg}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
