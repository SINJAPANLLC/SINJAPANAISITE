import { useState } from "react";
import { customerStore, type Customer } from "@/hooks/use-admin-data";
import { Plus, Trash2, ChevronDown } from "lucide-react";

const STATUS_COLORS: Record<Customer["status"], string> = {
  "未対応": "text-yellow-400 bg-yellow-400/10",
  "対応中": "text-blue-400 bg-blue-400/10",
  "成約": "text-green-400 bg-green-400/10",
  "失注": "text-red-400 bg-red-400/10",
};

const STATUSES: Customer["status"][] = ["未対応", "対応中", "成約", "失注"];

export function CustomerSection() {
  const [items, setItems] = useState<Customer[]>(() => customerStore.getAll());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", status: "未対応" as Customer["status"], notes: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = customerStore.add(form);
    setItems([item, ...items]);
    setForm({ name: "", company: "", email: "", phone: "", status: "未対応", notes: "" });
    setOpen(false);
  };

  const updateStatus = (id: string, status: Customer["status"]) => {
    customerStore.update(id, { status });
    setItems(items.map(c => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const remove = (id: string) => {
    customerStore.delete(id);
    setItems(items.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">顧客管理</h2>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 追加
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {STATUSES.map(s => (
          <div key={s} className="bg-white/5 border border-white/10 p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{s}</p>
            <p className="text-2xl font-black">{items.filter(c => c.status === s).length}</p>
          </div>
        ))}
      </div>

      {open && (
        <form onSubmit={submit} className="bg-white/5 border border-white/10 p-6 flex flex-col gap-4">
          <p className="text-xs font-bold text-gray-400 tracking-wider">新規顧客追加</p>
          <div className="grid grid-cols-2 gap-4">
            {[["お名前", "name", "山田 太郎"], ["会社名", "company", "株式会社〇〇"], ["メール", "email", "email@example.com"], ["電話", "phone", "03-0000-0000"]].map(([label, key, ph]) => (
              <div key={key}>
                <label className="text-[10px] text-gray-500 mb-1 block">{label}</label>
                <input type="text" placeholder={ph} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">ステータス</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Customer["status"] })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">メモ</label>
              <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-5 py-2">保存</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
          </div>
        </form>
      )}

      <div className="flex gap-6">
        <div className="flex-1 border border-white/10 overflow-hidden">
          {items.length === 0 && <div className="py-12 text-center text-xs text-gray-600">顧客がいません</div>}
          {items.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 flex items-center justify-between gap-4 ${selected?.id === c.id ? "bg-white/10" : ""}`}>
              <div>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-xs text-gray-500">{c.company}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="w-72 bg-white/5 border border-white/10 p-5 flex flex-col gap-4 flex-shrink-0">
            <div className="flex items-start justify-between">
              <h3 className="font-black">{selected.name}</h3>
              <button onClick={() => remove(selected.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">{selected.company}</p>
            <a href={`mailto:${selected.email}`} className="text-xs text-blue-400">{selected.email}</a>
            <p className="text-xs text-gray-400">{selected.phone}</p>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">ステータス変更</p>
              <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value as Customer["status"])}
                className="w-full h-8 bg-white/10 border border-white/10 text-white text-xs px-2 outline-none">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {selected.notes && <p className="text-xs text-gray-400 border-t border-white/10 pt-3">{selected.notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
