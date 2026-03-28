import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Column = {
  id: number; slug: string; title: string; category: string;
  content: string; metaDescription: string | null; createdAt: string;
};

export default function ColumnPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [column, setColumn] = useState<Column | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/columns/${slug}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(setColumn)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <main className="flex-1 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-3xl">
          <button onClick={() => navigate("/column")}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors mb-12">
            <ArrowLeft className="w-3.5 h-3.5" /> コラム一覧に戻る
          </button>

          {loading && (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}

          {notFound && (
            <div className="text-center py-24">
              <p className="text-sm text-gray-400">記事が見つかりません。</p>
            </div>
          )}

          {column && (
            <>
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
                    {column.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{fmtDate(column.createdAt)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">{column.title}</h1>
              </div>

              <article className="prose prose-sm max-w-none text-gray-700 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-bold [&_strong]:text-gray-900 [&_table]:w-full [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-gray-200 [&_th]:border [&_th]:border-gray-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{column.content}</ReactMarkdown>
              </article>

              <div className="mt-16 bg-gray-900 text-white p-8">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Contact</p>
                <h3 className="text-xl font-black mb-3">AIについてのご相談は<br />合同会社SIN JAPANへ</h3>
                <p className="text-sm text-gray-400 mb-6">
                  AI導入・開発について無料でご相談いただけます。
                </p>
                <button onClick={() => navigate("/#contact")}
                  className="flex items-center gap-2 text-sm font-bold bg-white text-gray-900 px-6 py-3 hover:bg-gray-100 transition-colors">
                  お問い合わせ <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
