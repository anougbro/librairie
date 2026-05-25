// ═══════════════════════════════════════════════
//  FACTORY PATTERN — UserFactory
//  Decouples user creation from the caller.
//  New roles can be registered without changing
//  existing code (Open / Closed Principle).
// ═══════════════════════════════════════════════

let _uid = 1;
const nextId = () => `U${String(_uid++).padStart(3, "0")}`;

const ROLES = {
  Student: (name, email, extra) => ({
    id:           nextId(),
    role:         "Student",
    name,
    email,
    borrowLimit:  3,
    loanDays:     14,
    notifications: [],
    ...extra,
  }),

  Teacher: (name, email, extra) => ({
    id:           nextId(),
    role:         "Teacher",
    name,
    email,
    borrowLimit:  10,
    loanDays:     30,
    department:   extra?.department || "General",
    notifications: [],
    ...extra,
  }),
};

export const UserFactory = {
  /**
   * Register a new role at runtime.
   * @param {string} role
   * @param {Function} builder  (name, email, extra) => userObject
   */
  register(role, builder) {
    ROLES[role] = builder;
  },

  /**
   * Create a user of the given role.
   * @param {"Student"|"Teacher"|string} role
   * @param {string} name
   * @param {string} email
   * @param {object} [extra]
   * @returns {object} user
   */
  create(role, name, email, extra = {}) {
    const builder = ROLES[role];
    if (!builder) {
      throw new Error(
        `Unknown role "${role}". Available: ${Object.keys(ROLES).join(", ")}`
      );
    }
    return builder(name, email, extra);
  },

  /** List all registered roles */
  roles() {
    return Object.keys(ROLES);
  },
};
