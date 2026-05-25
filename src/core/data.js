import { UserFactory } from "./UserFactory";

// ── ID generators ────────────────────────────────
let _uid = 1, _bid = 1;
export const nextUid = () => `U${String(_uid++).padStart(3, "0")}`;
export const nextBid = () => `B${String(_bid++).padStart(3, "0")}`;
export let   nextTid = (() => { let n=1; return () => `T${String(n++).padStart(3,"0")}`; })();

// ── Date helpers ─────────────────────────────────
export const today   = () => new Date().toISOString().slice(0, 10);
export const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── Seed data ────────────────────────────────────
export const SEED_USERS = [
  UserFactory.create("Student", "Alice Mensah",  "alice@uni.edu"),
  UserFactory.create("Teacher", "Dr. Kone",      "kone@uni.edu", { department: "Computer Science" }),
  UserFactory.create("Student", "Bob Kouassi",   "bob@uni.edu"),
];

export const SEED_BOOKS = [
  { id: nextBid(), title: "Clean Code",               author: "Robert C. Martin", isbn: "978-0132350884", genre: "Engineering", available: true },
  { id: nextBid(), title: "Design Patterns",           author: "Gang of Four",     isbn: "978-0201633610", genre: "Engineering", available: true },
  { id: nextBid(), title: "The Pragmatic Programmer",  author: "Andrew Hunt",      isbn: "978-0135957059", genre: "Engineering", available: true },
  { id: nextBid(), title: "Dune",                      author: "Frank Herbert",    isbn: "978-0441013593", genre: "Sci-Fi",      available: true },
  { id: nextBid(), title: "Atomic Habits",             author: "James Clear",      isbn: "978-0735211292", genre: "Self-Help",   available: true },
  { id: nextBid(), title: "1984",                      author: "George Orwell",    isbn: "978-0451524935", genre: "Fiction",     available: true },
];

export const GENRES = [
  "Engineering", "Fiction", "Sci-Fi", "Self-Help",
  "History", "Science", "Philosophy", "Other",
];

export const GENRE_COLORS = {
  Engineering: "#2980b9",
  Fiction:     "#7b5ea7",
  "Sci-Fi":    "#27ae60",
  "Self-Help": "#c9a84c",
  History:     "#c0392b",
  Science:     "#16a085",
  Philosophy:  "#8b7355",
  Other:       "#8b7355",
};

export const GENRE_ICONS = {
  Engineering: "⚙️",
  Fiction:     "📖",
  "Sci-Fi":    "🚀",
  "Self-Help": "💪",
  History:     "🏛️",
  Science:     "🔬",
  Philosophy:  "🦉",
  Other:       "📄",
};
