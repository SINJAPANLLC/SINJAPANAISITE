import { useState } from "react";
import { invoiceStore, type Invoice, type LineItem } from "@/hooks/use-admin-data";
import { Plus, Trash2, X } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ja-JP");
const calcTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
const TAX = 0.1;

const STATUS_COLORS: Record<Invoice["status"], string> = {
  unpaid: "text-yellow-400 bg-yellow-400/10",
  paid: "text-green-400 bg-green-400/10",
  overdue: "text-red-400 bg-red-400/10",
};
const STATUS_LABELS: Record<Invoice["status"], string> = { unpaid: "未払い", paid: "支払済", overdue: "期限超過" };

export function InvoiceSection() {
  const [items, setItems] = useState<Invoice[]>(() => invoiceStore.getAll());
  const [mode, setMode] = useState<"list" | "create">("list");
  const [form, setForm] = useState({ invoiceNo: "", client: "", company: "", email: "", date: "", dueDate: "", notes: "" });
  const [lines, setLines] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0 }]);

  const addLine = () => setLines([...lines, { description: "", qty: 1, unitPrice: 0 }]);
  const updateLine = (i: number, key: keyof LineItem, val: string | number) =>
    setLines(lines.map((l, idx) => idx === i ? { ...l, [key]: key === "description" ? val : Number(val) } : l));
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));

  const updateStatus = (id: string, status: Invoice["status"]) => {
    invoiceStore.update(id, { status });
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = invoiceStore.add({ ...form, items: lines, status: "unpaid" });
    setItems([item, ...items]);
    setMode("list");
    setLines([{ description: "", qty: 1, unitPrice: 0 }]);
    setForm({ invoiceNo: "", client: "", company: "", email: "", date: "", dueDate: "", notes: "" });
  };

  if (mode === "create") return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">請求書発行</h2>
        <button type="button" onClick={() => setMode("list")} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[["請求書番号", "invoiceNo", "INV-001"], ["顧客名", "client", "山田 太郎"], ["会社名", "company", "株式会社〇〇"],
          ["メール", "email", "email@example.com"], ["請求日", "date", ""], ["支払期限", "dueDate", ""]].map(([label, key, ph]) => (
          <div key={key}>
            <label className="text-[10px] text-gray-500 mb-1 block">{label}</label>
            <input type={key.includes("date") || key.includes("Due") ? "date" : "text"} placeholder={ph} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">明細</p>
          <button type="button" onClick={addLine} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3" />行追加</button>
        </div>
        <div className="border border-white/10">
          <div className="grid grid-cols-12 px-3 py-2 border-b border-white/10 text-[10px] text-gray-500">
            <span className="col-span-6">内容</span><span className="col-span-2 text-right">数量</span>
            <span className="col-span-3 text-right">単価</span><span className="col-span-1" />
          </div>
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-white/5">
              <input className="col-span-6 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 outline-none" placeholder="サービス内容" value={l.description}
                onChange={e => updateLine(i, "description", e.target.value)} />
              <input type="number" className="col-span-2 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 text-right outline-none" value={l.qty}
                onChange={e => updateLine(i, "qty", e.target.value)} />
              <input type="number" className="col-span-3 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 text-right outline-none" value={l.unitPrice}
                onChange={e => updateLine(i, "unitPrice", e.target.value)} />
              <button type="button" onClick={() => removeLine(i)} className="col-span-1 flex items-center justify-center text-gray-600 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex flex-col items-end px-3 py-3 gap-1 text-sm">
            <span className="text-gray-400">小計：¥{fmt(calcTotal(lines))}</span>
            <span className="text-gray-400">消費税（10%）：¥{fmt(Math.floor(calcTotal(lines) * TAX))}</span>
            <span className="font-black text-base">合計：¥{fmt(Math.floor(calcTotal(lines) * (1 + TAX)))}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-gray-500 mb-1 block">備考</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full h-20 bg-white/10 border border-white/10 text-white text-sm px-3 py-2 outline-none resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-6 py-2">発行する</button>
        <button type="button" onClick={() => setMode("list")} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">請求書管理</h2>
        <button onClick={() => setMode("create")} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新規発行
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(["unpaid", "paid", "overdue"] as Invoice["status"][]).map(s => (
          <div key={s} className={`border p-4 ${s === "paid" ? "border-green-400/20" : s === "overdue" ? "border-red-400/20" : "border-white/10"}`}>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{STATUS_LABELS[s]}</p>
            <p className="text-2xl font-black">¥{fmt(items.filter(i => i.status === s).reduce((s2, i) => s2 + Math.floor(calcTotal(i.items) * 1.1), 0))}</p>
          </div>
        ))}
      </div>
      <div className="border border-white/10">
        <div className="grid grid-cols-5 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
          <span>番号</span><span>顧客</span><span>支払期限</span><span className="text-right">金額</span><span className="text-right">状態</span>
        </div>
        {items.length === 0 && <div className="py-12 text-center text-xs text-gray-600">請求書はありません</div>}
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-5 px-4 py-3 border-b border-white/5 text-sm hover:bg-white/5 group">
            <span className="font-mono text-xs text-gray-400">{item.invoiceNo}</span>
            <span>{item.client}</span>
            <span className="text-gray-400 text-xs">{item.dueDate}</span>
            <span className="text-right font-bold">¥{fmt(Math.floor(calcTotal(item.items) * 1.1))}</span>
            <div className="flex justify-end">
              <select value={item.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(item.id, e.target.value as Invoice["status"])}
                className={`text-[10px] font-bold px-2 py-0.5 bg-transparent border-0 outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}>
                {(["unpaid", "paid", "overdue"] as Invoice["status"][]).map(s => <option key={s} value={s} className="text-black">{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
