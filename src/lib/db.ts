export interface User {
  id: string;
  email: string;
  passwordHash: string;
  failedLogins: number;
}
export interface Session {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}
export interface Charge {
  id: string;
  customerId: string;
  amount: number;
  status: "authorized" | "captured" | "refunded" | "declined";
}
export interface Order {
  id: string;
  userId: string;
  items: string[];
  chargeId: string;
  total: number;
}

/** In-memory store. Reset between test files. */
export const db = {
  users: new Map<string, User>(),
  sessions: new Map<string, Session>(),
  charges: new Map<string, Charge>(),
  orders: new Map<string, Order>(),
  reset() {
    this.users.clear();
    this.sessions.clear();
    this.charges.clear();
    this.orders.clear();
  },
};

export function userByEmail(email: string): User | undefined {
  for (const u of db.users.values()) if (u.email === email) return u;
  return undefined;
}
