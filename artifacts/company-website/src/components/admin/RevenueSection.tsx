import { useState } from "react";
import { revenueStore, type Revenue } from "@/hooks/use-admin-data";
import { Plus, Trash2, TrendingUp } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ja-JP");

export function RevenueSection() {
  const [items, setItems] = useState<Revenue[]>(() => revenueStore.getAll());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", client: "", description: "", amount: "" });

  const total = items.reduce((s, i) => s + i.amount, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = revenueStore.add({ ...form, amount: Number(form.amount) });
    setItems([item, ...items]);
    setForm({ date: "", client: "", description: "", amount: "" });
    setOpen(false);
  };

  const remove = (id: string) => {
    revenueStore.delete(id);
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">収益管理</h2>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 追加
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 flex items-center gap-4">
        <TrendingUp className="w-8 h-8 text-gray-400" />
        <div>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">累計収益</p>
          <p className="text-3xl font-black">¥{fmt(total)}</p>
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="bg-white/5 border border-white/10 p-6 flex flex-col gap-4">
          <p className="text-xs font-bold text-gray-400 tracking-wider">新規追加</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">日付</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">金額（円）</label>
              <input type="number" required placeholder="100000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">顧客名</label>
              <input type="text" required placeholder="株式会社〇〇" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">内容</label>
              <input type="text" required placeholder="AI導入支援" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-5 py-2">保存</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
          </div>
        </form>
      )}

      <div className="border border-white/10">
        <div className="grid grid-cols-4 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
          <span>日付</span><span>顧客</span><span>内容</span><span className="text-right">金額</span>
        </div>
        {items.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-600">データがありません</div>
        )}
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-4 px-4 py-3 border-b border-white/5 text-sm hover:bg-white/5 group">
            <span className="text-gray-400 font-mono text-xs">{item.date}</span>
            <span>{item.client}</span>
            <span className="text-gray-400 truncate">{item.description}</span>
            <div className="flex items-center justify-end gap-3">
              <span className="font-bold">¥{fmt(item.amount)}</span>
              <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
