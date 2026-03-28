import { useState } from "react";
import { adminNewsStore, type AdminNews } from "@/hooks/use-admin-data";
import { Plus, Trash2 } from "lucide-react";

export function NewsSection() {
  const [items, setItems] = useState<AdminNews[]>(() => adminNewsStore.getAll());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", category: "お知らせ", title: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = adminNewsStore.add(form);
    setItems([item, ...items]);
    setForm({ date: "", category: "お知らせ", title: "" });
    setOpen(false);
  };

  const remove = (id: string) => {
    adminNewsStore.delete(id);
    setItems(items.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">お知らせ管理</h2>
          <p className="text-xs text-gray-500 mt-1">ここで作成した記事がサイトのお知らせに反映されます</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 追加
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="bg-white/5 border border-white/10 p-6 flex flex-col gap-4">
          <p className="text-xs font-bold text-gray-400 tracking-wider">新規お知らせ追加</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">日付</label>
              <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">カテゴリ</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none">
                {["お知らせ", "プレスリリース", "サービス", "受賞", "導入事例", "採用"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">タイトル</label>
              <input type="text" required placeholder="お知らせのタイトル" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-5 py-2">公開する</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
          </div>
        </form>
      )}

      <div className="border border-white/10">
        <div className="grid grid-cols-4 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
          <span>日付</span><span>カテゴリ</span><span className="col-span-2">タイトル</span>
        </div>
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-4 px-4 py-3 border-b border-white/5 text-sm hover:bg-white/5 group items-center">
            <span className="font-mono text-xs text-gray-400">{item.date}</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 border border-white/10 px-2 py-0.5 w-fit">{item.category}</span>
            <span className="col-span-2 flex items-center justify-between">
              <span className="truncate pr-4">{item.title}</span>
              <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        ))}
        {items.length === 0 && <div className="py-12 text-center text-xs text-gray-600">お知らせはありません</div>}
      </div>
    </div>
  );
}
