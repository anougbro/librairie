import { useReducer, useState } from "react";

import Sidebar      from "./components/Sidebar";
import Toast        from "./components/Toast";
import Dashboard    from "./sections/Dashboard";
import Users        from "./sections/Users";
import Books        from "./sections/Books";
import Transactions from "./sections/Transactions";

import { libraryReducer, initialState } from "./core/reducer";

// ═══════════════════════════════════════════════════
//  APP — Singleton Pattern via useReducer
//  Single source of truth for the entire system.
// ═══════════════════════════════════════════════════
export default function App() {
  // Singleton: one reducer = one central library system
  const [state, dispatch] = useReducer(libraryReducer, initialState);
  const [tab,   setTab]   = useState("dashboard");

  const sections = {
    dashboard:    <Dashboard    state={state} dispatch={dispatch} />,
    users:        <Users        state={state} dispatch={dispatch} />,
    books:        <Books        state={state} dispatch={dispatch} />,
    transactions: <Transactions state={state} dispatch={dispatch} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Dark sidebar navigation ── */}
      <Sidebar tab={tab} setTab={setTab} state={state} />

      {/* ── Main content area ── */}
      <main
        style={{
          flex:      1,
          padding:   "32px 36px",
          overflowY: "auto",
          minWidth:  0,
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily:    "'DM Mono', monospace",
            fontSize:      11,
            color:         "var(--warm)",
            marginBottom:  20,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Bibliothèque / {tab}
        </div>

        {/* Active section */}
        {sections[tab]}
      </main>

      {/* ── Global toast notifications ── */}
      <Toast toast={state.toast} dispatch={dispatch} />
    </div>
  );
}
