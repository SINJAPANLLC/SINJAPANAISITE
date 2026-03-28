import { useState } from "react";
import { agencyStore, type Agency } from "@/hooks/use-admin-data";
import { Plus, Trash2, X, Edit2, Check, Building2, TrendingUp, Users } from "lucide-react";

const STATUS_LABELS: Record<Agency["status"], string> = { active: "稼働中", inactive: "停止中", trial: "トライアル" };
const STATUS_COLORS: Record<Agency["status"], string> = {
  active: "text-green-400 border-green-400/30 bg-green-400/5",
  inactive: "text-gray-500 border-gray-500/30 bg-gray-500/5",
  trial: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
};

const EMPTY: Omit<Agency, "id" | "createdAt"> = {
  company: "", contact: "", email: "", phone: "", region: "", commissionRate: 10, dealCount: 0, status: "trial", notes: "",
};

export function AgencySection() {
  const [list, setList] = useState<Agency[]>(() => agencyStore.getAll());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState<Agency["status"] | "all">("all");
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");

  const refresh = () => setList(agencyStore.getAll());

  const handleSubmit = () => {
    if (!form.company.trim()) return;
    if (editing) {
      agencyStore.update(editing, form);
      setEditing(null);
    } else {
      agencyStore.add(form);
    }
    setForm({ ...EMPTY });
    setShowForm(false);
    refresh();
  };

  const startEdit = (a: Agency) => {
    setForm({ company: a.company, contact: a.contact, email: a.email, phone: a.phone, region: a.region, commissionRate: a.commissionRate, dealCount: a.dealCount, status: a.status, notes: a.notes });
    setEditing(a.id);
    setShowForm(true);
  };

  const del = (id: string) => { agencyStore.delete(id); refresh(); };

  const cycleStatus = (a: Agency) => {
    const next: Agency["status"] = a.status === "trial" ? "active" : a.status === "active" ? "inactive" : "trial";
    agencyStore.update(a.id, { status: next });
    refresh();
  };

  const incrementDeal = (a: Agency) => {
    agencyStore.update(a.id, { dealCount: a.dealCount + 1 });
    refresh();
  };

  const saveNote = (id: string) => {
    agencyStore.update(id, { notes: editNote });
    setEditNoteId(null);
    refresh();
  };

  const displayed = filter === "all" ? list : list.filter(a => a.status === filter);
  const totalDeals = list.reduce((s, a) => s + a.dealCount, 0);
  const activeCount = list.filter(a => a.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">代理店管理</h2>
        <button
          onClick={() => { setShowForm(v => !v); setEditing(null); setForm({ ...EMPTY }); }}
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 代理店を追加
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Building2, label: "登録代理店", value: list.length + "社" },
          { icon: Users, label: "稼働中", value: activeCount + "社" },
          { icon: TrendingUp, label: "紹介件数合計", value: totalDeals + "件" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="border border-white/10 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-gray-500" />
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">{label}</p>
            </div>
            <p className="text-xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border border-white/20 bg-white/3 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">
              — {editing ? "代理店情報を編集" : "新規代理店登録"}
            </p>
            <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-4 h-4 text-gray-500" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "会社名 *", key: "company", placeholder: "株式会社○○" },
              { label: "担当者名", key: "contact", placeholder: "田中 太郎" },
              { label: "メールアドレス", key: "email", placeholder: "partner@example.co.jp" },
              { label: "電話番号", key: "phone", placeholder: "03-0000-0000" },
              { label: "地域", key: "region", placeholder: "関東" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 tracking-widest uppercase">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="h-9 bg-white/5 border border-white/10 text-sm text-white px-3 outline-none focus:border-white/30 placeholder-gray-600"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 tracking-widest uppercase">報酬率（%）</label>
              <input
                type="number" min="0" max="100"
                value={form.commissionRate}
                onChange={e => setForm({ ...form, commissionRate: Number(e.target.value) })}
                className="h-9 bg-white/5 border border-white/10 text-sm text-white px-3 outline-none focus:border-white/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-500 tracking-widest uppercase">ステータス</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as Agency["status"] })}
                className="h-9 bg-gray-900 border border-white/10 text-sm text-white px-3 outline-none focus:border-white/30"
              >
                <option value="trial">トライアル</option>
                <option value="active">稼働中</option>
                <option value="inactive">停止中</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-500 tracking-widest uppercase">備考</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="bg-white/5 border border-white/10 text-sm text-gray-300 px-3 py-2 outline-none resize-none focus:border-white/30"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit}
              className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
              <Check className="w-3.5 h-3.5" /> {editing ? "更新する" : "登録する"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-xs text-gray-500 hover:text-white border border-white/10 px-4 py-2">
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "active", "trial", "inactive"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] font-bold px-3 py-1.5 border transition-colors ${filter === f ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-gray-500 hover:text-white"}`}>
            {f === "all" ? "すべて" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 && (
        <div className="border border-white/10 flex items-center justify-center h-32">
          <p className="text-xs text-gray-600">代理店がありません</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {displayed.map(a => (
          <div key={a.id} className="border border-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <p className="text-sm font-black">{a.company}</p>
                  <button onClick={() => cycleStatus(a)}
                    className={`text-[10px] font-bold px-2 py-0.5 border rounded-sm transition-colors cursor-pointer ${STATUS_COLORS[a.status]}`}>
                    {STATUS_LABELS[a.status]}
                  </button>
                  <span className="text-[10px] text-gray-500">報酬率 {a.commissionRate}%</span>
                </div>
                <div className="flex gap-4 flex-wrap text-[11px] text-gray-500">
                  {a.contact && <span>担当: {a.contact}</span>}
                  {a.email && <span>{a.email}</span>}
                  {a.phone && <span>{a.phone}</span>}
                  {a.region && <span>地域: {a.region}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">紹介数</p>
                  <button onClick={() => incrementDeal(a)}
                    className="text-lg font-black hover:text-green-400 transition-colors">
                    {a.dealCount}
                  </button>
                </div>
                <button onClick={() => startEdit(a)} className="text-gray-600 hover:text-white p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => del(a.id)} className="text-gray-600 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Notes */}
            {editNoteId === a.id ? (
              <div className="flex gap-2">
                <input value={editNote} onChange={e => setEditNote(e.target.value)}
                  className="flex-1 h-8 bg-white/5 border border-white/20 text-xs text-white px-3 outline-none" />
                <button onClick={() => saveNote(a.id)} className="text-xs text-green-400 px-2">保存</button>
                <button onClick={() => setEditNoteId(null)} className="text-xs text-gray-500 px-2">取消</button>
              </div>
            ) : (
              <button onClick={() => { setEditNoteId(a.id); setEditNote(a.notes); }}
                className="text-left text-xs text-gray-600 hover:text-gray-400 transition-colors">
                {a.notes || "+ メモを追加"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
