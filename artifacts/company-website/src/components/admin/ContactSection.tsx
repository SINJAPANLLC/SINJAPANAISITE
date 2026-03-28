import { useState, useEffect } from "react";
import { Mail, Building2, User, MessageSquare, Clock, Loader2, RefreshCw } from "lucide-react";

type Contact = {
  id: number;
  name: string;
  company: string;
  email: string;
  message: string;
  createdAt: string;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });

async function fetchContacts(): Promise<Contact[]> {
  const password = import.meta.env.VITE_ADMIN_PASSWORD || "";
  const res = await fetch("/api/contacts", {
    headers: { "x-admin-token": password },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export function ContactSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Contact | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">お問い合わせ</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{contacts.length}件</span>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            更新
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40 gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs">読み込み中...</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <p className="text-xs text-red-400">{error}</p>
          <button onClick={load} className="text-xs text-gray-500 underline">再試行</button>
        </div>
      )}

      {!loading && !error && (
        <div className="flex gap-6 flex-1">
          {/* List */}
          <div className="w-80 border border-white/10 flex-shrink-0 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Mail className="w-8 h-8 text-gray-700" />
                <p className="text-xs text-gray-600">まだお問い合わせはありません</p>
              </div>
            ) : (
              contacts.map(c => (
                <button key={c.id} onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selected?.id === c.id ? "bg-white/10" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-bold truncate">{c.name}</span>
                    <span className="text-[10px] text-gray-600 flex-shrink-0 font-mono">{fmtDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.company}</p>
                  <p className="text-xs text-gray-600 truncate mt-1">{c.message}</p>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="flex-1">
            {selected ? (
              <div className="max-w-xl flex flex-col gap-5">
                <h3 className="font-black text-base">{selected.name} 様</h3>
                <div className="flex flex-col gap-4 bg-white/5 border border-white/10 p-6">
                  {[
                    { Icon: User, label: "お名前", val: selected.name },
                    { Icon: Building2, label: "会社名", val: selected.company },
                    { Icon: Mail, label: "メール", val: selected.email },
                    { Icon: Clock, label: "受信日時", val: fmtDate(selected.createdAt) },
                  ].map(({ Icon, label, val }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">{label}</p>
                        <p className="text-sm font-bold">{val}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">お問い合わせ内容</p>
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>
                  </div>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: お問い合わせありがとうございます`}
                  className="inline-flex items-center gap-2 h-9 px-5 bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors self-start">
                  <Mail className="w-3.5 h-3.5" /> 返信する
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <MessageSquare className="w-8 h-8 text-gray-700" />
                <p className="text-xs text-gray-600">左のリストから選択してください</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
