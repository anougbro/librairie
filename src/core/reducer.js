// ═══════════════════════════════════════════════
//  SINGLETON PATTERN — LibrarySystem state
//  useReducer acts as the single source of truth.
//  All mutations go through this reducer.
//
//  OBSERVER PATTERN — notifications array per user
//  Every borrow / return / overdue event pushes
//  a timestamped message into the user's inbox.
// ═══════════════════════════════════════════════

import { UserFactory } from "./UserFactory";
import { today, addDays, nextTid, nextBid, SEED_BOOKS, SEED_USERS } from "./data";

// ── Initial state ────────────────────────────────
export const initialState = {
  users:        SEED_USERS,
  books:        SEED_BOOKS,
  transactions: [],
  toast:        null,
};

// ── Helper: push a notification into a user ──────
const withNotification = (user, msg) => ({
  ...user,
  notifications: [
    ...user.notifications,
    { id: Date.now(), msg, date: today() },
  ],
});

// ── Reducer ──────────────────────────────────────
export function libraryReducer(state, action) {
  switch (action.type) {

    /* ── USER MANAGEMENT ── */
    case "ADD_USER": {
      const user = UserFactory.create(
        action.role,
        action.name,
        action.email,
        action.extra || {}
      );
      return {
        ...state,
        users: [...state.users, user],
        toast: { msg: `${user.name} ajouté(e) comme ${user.role}`, kind: "ok" },
      };
    }

    case "REMOVE_USER": {
      const active = state.transactions.filter(
        (t) => t.userId === action.id && !t.returnDate
      );
      if (active.length)
        return { ...state, toast: { msg: "Impossible — emprunts actifs en cours", kind: "err" } };

      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.id),
        toast: { msg: "Utilisateur supprimé", kind: "ok" },
      };
    }

    /* ── BOOK MANAGEMENT ── */
    case "ADD_BOOK": {
      const book = {
        id:        nextBid(),
        title:     action.title,
        author:    action.author,
        isbn:      action.isbn || "N/A",
        genre:     action.genre,
        available: true,
      };
      return {
        ...state,
        books: [...state.books, book],
        toast: { msg: `"${book.title}" ajouté au catalogue`, kind: "ok" },
      };
    }

    case "REMOVE_BOOK": {
      const book = state.books.find((b) => b.id === action.id);
      if (!book?.available)
        return { ...state, toast: { msg: "Impossible — livre actuellement emprunté", kind: "err" } };

      return {
        ...state,
        books: state.books.filter((b) => b.id !== action.id),
        toast: { msg: "Livre supprimé", kind: "ok" },
      };
    }

    /* ── BORROWING SYSTEM ── */
    case "BORROW": {
      const user = state.users.find((u) => u.id === action.userId);
      const book = state.books.find((b) => b.id === action.bookId);
      if (!user || !book) return state;

      const activeBorrows = state.transactions.filter(
        (t) => t.userId === user.id && !t.returnDate
      ).length;

      if (activeBorrows >= user.borrowLimit)
        return { ...state, toast: { msg: `Limite d'emprunt atteinte (${user.borrowLimit})`, kind: "err" } };

      if (!book.available)
        return { ...state, toast: { msg: "Livre non disponible", kind: "err" } };

      const dueDate = addDays(today(), user.loanDays);
      const tx = {
        id:         nextTid(),
        userId:     user.id,
        bookId:     book.id,
        borrowDate: today(),
        dueDate,
        returnDate: null,
        overdue:    false,
      };

      return {
        ...state,
        books:        state.books.map((b) => b.id === book.id ? { ...b, available: false } : b),
        transactions: [...state.transactions, tx],
        users:        state.users.map((u) =>
          u.id === user.id
            ? withNotification(u, `Emprunté "${book.title}" — à rendre le ${dueDate}`)
            : u
        ),
        toast: { msg: `"${book.title}" emprunté par ${user.name}`, kind: "ok" },
      };
    }

    case "RETURN": {
      const tx = state.transactions.find((t) => t.id === action.txId);
      if (!tx || tx.returnDate) return state;

      const user = state.users.find((u) => u.id === tx.userId);
      const book = state.books.find((b) => b.id === tx.bookId);

      return {
        ...state,
        books:        state.books.map((b) => b.id === tx.bookId ? { ...b, available: true } : b),
        transactions: state.transactions.map((t) =>
          t.id === tx.id ? { ...t, returnDate: today() } : t
        ),
        users: state.users.map((u) =>
          u.id === user?.id
            ? withNotification(u, `Retourné "${book?.title}" — merci !`)
            : u
        ),
        toast: { msg: `"${book?.title}" retourné`, kind: "ok" },
      };
    }

    case "MARK_OVERDUE": {
      const tx = state.transactions.find((t) => t.id === action.txId);
      if (!tx) return state;
      const user = state.users.find((u) => u.id === tx.userId);
      const book = state.books.find((b) => b.id === tx.bookId);

      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.txId ? { ...t, overdue: true } : t
        ),
        users: state.users.map((u) =>
          u.id === user?.id
            ? withNotification(u, `⚠ RETARD : "${book?.title}" était dû le ${tx.dueDate}. Merci de le retourner.`)
            : u
        ),
        toast: { msg: "Marqué en retard — utilisateur notifié", kind: "warn" },
      };
    }

    /* ── UI ── */
    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}
