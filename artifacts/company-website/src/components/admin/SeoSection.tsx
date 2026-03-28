import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, RefreshCw, Sparkles, ExternalLink, Clock } from "lucide-react";
import { useLocation } from "wouter";

type Column = { id: number; slug: string; title: string; category: string; metaDescription: string | null; createdAt: string };

const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });

const SUGGESTED_TOPICS = [
  "中小企業のAI導入で失敗しない5つのポイント",
  "ChatGPTを業務に活用する具体的な方法",
  "製造業でAIを使って生産効率を上げる事例",
  "AIチャットボット導入で顧客対応を自動化する方法",
  "物流業界におけるAI活用の最新トレンド",
  "DX推進の第一歩：AIツール選びの基準とは",
  "AIで経営判断を支援するデータ分析の実践",
];

export function SeoSection() {
  const [, navigate] = useLocation();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [showTopics, setShowTopics] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/columns").then(r => r.ok ? r.json() : []);
      setColumns(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const generate = async (customTopic?: string) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/columns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ topic: customTopic || topic || undefined }),
      });
      if (res.ok) {
        const col = await res.json();
        setColumns([col, ...columns]);
        setTopic("");
      }
    } finally { setGenerating(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/columns/${id}`, { method: "DELETE", headers: { "x-admin-token": TOKEN() } });
    setColumns(columns.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">SEOコラム管理</h2>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> 毎日7:00（JST）にAIが自動でコラムを1本生成します
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> 更新
        </button>
      </div>

      {/* AI Generate Panel */}
      <div className="bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> AI記事生成
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="テーマを入力（空欄でAIが自動選択）"
              className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none focus:border-white/30 placeholder:text-gray-600"
            />
            <button type="button" onClick={() => setShowTopics(!showTopics)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-white transition-colors">
              候補
            </button>
          </div>
          <button onClick={() => generate()}
            disabled={generating}
            className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-5 py-2 hover:bg-gray-100 disabled:opacity-60 flex-shrink-0">
            {generating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />生成中...</> : <><Sparkles className="w-3.5 h-3.5" />今すぐ生成</>}
          </button>
        </div>
        {showTopics && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map(t => (
              <button key={t} onClick={() => { setTopic(t); setShowTopics(false); }}
                className="text-[10px] text-gray-400 border border-white/10 px-2 py-1 hover:text-white hover:border-white/30 transition-colors">
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Column List */}
      {loading ? (
        <div className="flex items-center justify-center h-32 gap-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" /><span className="text-xs">読み込み中...</span>
        </div>
      ) : (
        <div className="border border-white/10">
          <div className="grid grid-cols-12 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
            <span className="col-span-1">日付</span>
            <span className="col-span-2">カテゴリ</span>
            <span className="col-span-7">タイトル</span>
            <span className="col-span-2 text-right">操作</span>
          </div>
          {columns.length === 0 && (
            <div className="py-12 text-center text-xs text-gray-600">
              コラムはまだありません。<br />「今すぐ生成」をクリックしてください。
            </div>
          )}
          {columns.map(col => (
            <div key={col.id} className="grid grid-cols-12 px-4 py-3 border-b border-white/5 text-sm hover:bg-white/5 group items-center">
              <span className="col-span-1 font-mono text-[10px] text-gray-500">{fmtDate(col.createdAt)}</span>
              <span className="col-span-2 text-[10px] text-gray-400 border border-white/10 px-1.5 py-0.5 w-fit">{col.category}</span>
              <span className="col-span-7 text-xs font-bold truncate pr-2">{col.title}</span>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button onClick={() => navigate(`/column/${col.slug}`)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-all" title="記事を見る">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => remove(col.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 p-4">
        <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">自動生成スケジュール</p>
        <p className="text-xs text-gray-400">毎日 <span className="text-white font-bold">7:00 AM（JST）</span> にAIが自動でコラムを1本生成し、<a href="/column" target="_blank" className="text-blue-400 underline">/column</a> ページに公開されます。</p>
      </div>
    </div>
  );
}
