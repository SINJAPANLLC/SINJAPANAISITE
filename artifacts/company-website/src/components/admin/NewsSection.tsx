import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, RefreshCw, Globe } from "lucide-react";

type NewsItem = { id: number; date: string; category: string; title: string; createdAt: string };

const ADMIN_TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

export function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: "お知らせ", title: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/news", { headers: { "x-admin-token": ADMIN_TOKEN() } }).then(r => r.json());
      setItems(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": ADMIN_TOKEN() },
        body: JSON.stringify(form),
      });
      const item = await res.json();
      setItems([item, ...items]);
      setForm({ date: new Date().toISOString().slice(0, 10), category: "お知らせ", title: "" });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE", headers: { "x-admin-token": ADMIN_TOKEN() } });
    setItems(items.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">お知らせ管理</h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Globe className="w-3 h-3" /> 追加するとHPのお知らせに即時反映されます
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> 更新
          </button>
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
            <Plus className="w-3.5 h-3.5" /> 追加
          </button>
        </div>
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
            <button type="submit" disabled={saving} className="text-xs font-bold bg-white text-gray-900 px-5 py-2 disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-3 h-3 animate-spin" />} 公開する
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32 gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-xs">読み込み中...</span></div>
      ) : (
        <div className="border border-white/10">
          <div className="grid grid-cols-4 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
            <span>日付</span><span>カテゴリ</span><span className="col-span-2">タイトル</span>
          </div>
          {items.length === 0 && <div className="py-12 text-center text-xs text-gray-600">お知らせはありません</div>}
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
        </div>
      )}
    </div>
  );
}
