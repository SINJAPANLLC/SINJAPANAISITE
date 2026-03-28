import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Loader2, Calendar, Tag } from "lucide-react";

type ColumnItem = {
  id: number; slug: string; title: string; category: string;
  metaDescription: string | null; createdAt: string;
};

export default function ColumnList() {
  const [, navigate] = useLocation();
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/columns")
      .then(r => r.json())
      .then(setColumns)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <main className="flex-1 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Column</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">AIコラム</h1>
            <p className="text-sm text-gray-500 mt-4 max-w-xl">
              AI導入・DX推進に関する最新情報や実践的なノウハウをお届けします。
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">読み込み中...</span>
            </div>
          )}

          {!loading && columns.length === 0 && (
            <div className="text-center py-24">
              <p className="text-sm text-gray-400">コラムはまだありません。</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns.map(col => (
              <button key={col.id} onClick={() => navigate(`/column/${col.slug}`)}
                className="text-left bg-white border border-gray-100 p-8 hover:border-gray-300 hover:shadow-sm transition-all group flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
                    {col.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{fmtDate(col.createdAt)}
                  </span>
                </div>
                <h2 className="text-base font-black text-gray-900 leading-snug group-hover:text-gray-600 transition-colors">
                  {col.title}
                </h2>
                {col.metaDescription && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{col.metaDescription}</p>
                )}
                <div className="flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors mt-auto">
                  続きを読む <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
