// Central localStorage-based data store for admin

export type Revenue = {
  id: string; date: string; client: string; description: string; amount: number; createdAt: string;
};
export type Customer = {
  id: string; name: string; company: string; email: string; phone: string;
  status: "未対応" | "対応中" | "成約" | "失注"; notes: string; createdAt: string;
};
export type LineItem = { description: string; qty: number; unitPrice: number };
export type Estimate = {
  id: string; estimateNo: string; client: string; company: string; email: string;
  date: string; validUntil: string; items: LineItem[]; notes: string;
  status: "draft" | "sent" | "accepted" | "rejected"; createdAt: string;
};
export type Invoice = {
  id: string; invoiceNo: string; client: string; company: string; email: string;
  date: string; dueDate: string; items: LineItem[]; notes: string;
  status: "unpaid" | "paid" | "overdue"; createdAt: string;
};
export type AdminNews = {
  id: string; date: string; category: string; title: string; createdAt: string;
};

function getStore<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// Revenue
export const revenueStore = {
  getAll: (): Revenue[] => getStore("sj_revenue"),
  add: (d: Omit<Revenue, "id" | "createdAt">): Revenue => {
    const item = { ...d, id: uid(), createdAt: new Date().toISOString() };
    setStore("sj_revenue", [item, ...revenueStore.getAll()]);
    return item;
  },
  delete: (id: string) => setStore("sj_revenue", revenueStore.getAll().filter(r => r.id !== id)),
};

// Customers
export const customerStore = {
  getAll: (): Customer[] => getStore("sj_customers"),
  add: (d: Omit<Customer, "id" | "createdAt">): Customer => {
    const item = { ...d, id: uid(), createdAt: new Date().toISOString() };
    setStore("sj_customers", [item, ...customerStore.getAll()]);
    return item;
  },
  update: (id: string, d: Partial<Customer>) => {
    setStore("sj_customers", customerStore.getAll().map(c => c.id === id ? { ...c, ...d } : c));
  },
  delete: (id: string) => setStore("sj_customers", customerStore.getAll().filter(c => c.id !== id)),
};

// Estimates
export const estimateStore = {
  getAll: (): Estimate[] => getStore("sj_estimates"),
  add: (d: Omit<Estimate, "id" | "createdAt">): Estimate => {
    const item = { ...d, id: uid(), createdAt: new Date().toISOString() };
    setStore("sj_estimates", [item, ...estimateStore.getAll()]);
    return item;
  },
  update: (id: string, d: Partial<Estimate>) => {
    setStore("sj_estimates", estimateStore.getAll().map(e => e.id === id ? { ...e, ...d } : e));
  },
  delete: (id: string) => setStore("sj_estimates", estimateStore.getAll().filter(e => e.id !== id)),
};

// Invoices
export const invoiceStore = {
  getAll: (): Invoice[] => getStore("sj_invoices"),
  add: (d: Omit<Invoice, "id" | "createdAt">): Invoice => {
    const item = { ...d, id: uid(), createdAt: new Date().toISOString() };
    setStore("sj_invoices", [item, ...invoiceStore.getAll()]);
    return item;
  },
  update: (id: string, d: Partial<Invoice>) => {
    setStore("sj_invoices", invoiceStore.getAll().map(i => i.id === id ? { ...i, ...d } : i));
  },
  delete: (id: string) => setStore("sj_invoices", invoiceStore.getAll().filter(i => i.id !== id)),
};

// Admin News
const DEFAULT_NEWS: AdminNews[] = [
  { id: "default-1", date: "2026.03.28", category: "お知らせ", title: "ホームページをリニューアルしました", createdAt: new Date().toISOString() },
];
export const adminNewsStore = {
  getAll: (): AdminNews[] => {
    const stored = getStore<AdminNews>("sj_admin_news");
    return stored.length > 0 ? stored : DEFAULT_NEWS;
  },
  add: (d: Omit<AdminNews, "id" | "createdAt">): AdminNews => {
    const item = { ...d, id: uid(), createdAt: new Date().toISOString() };
    const existing = adminNewsStore.getAll();
    setStore("sj_admin_news", [item, ...existing]);
    return item;
  },
  delete: (id: string) => {
    const existing = adminNewsStore.getAll();
    setStore("sj_admin_news", existing.filter(n => n.id !== id));
  },
};

// Visitor Log
export type VisitorLog = {
  id: string; path: string; title: string; userAgent: string; referrer: string; ts: number;
};
export const visitorLogStore = {
  getAll: (): VisitorLog[] => getStore("sj_visitor_log"),
  add: (d: Omit<VisitorLog, "id">) => {
    const all = visitorLogStore.getAll();
    const item = { ...d, id: uid() };
    setStore("sj_visitor_log", [item, ...all].slice(0, 500));
  },
};
