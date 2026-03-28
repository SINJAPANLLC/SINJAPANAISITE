import { useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, ChevronRight, Loader2 } from "lucide-react";

const PURPOSES = ["AI導入を検討している", "競合調査・情報収集", "投資・提携検討", "採用・就職活動", "その他"];

export default function Download() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", department: "", purpose: "",
  });

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/download-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // continue to brochure even if notification fails
    }
    const leads = JSON.parse(localStorage.getItem("sj_download_leads") || "[]");
    leads.unshift({ ...form, id: Date.now().toString(36), createdAt: new Date().toISOString() });
    localStorage.setItem("sj_download_leads", JSON.stringify(leads));
    navigate("/brochure");
  };

  const inp = "w-full h-11 border border-gray-200 bg-white text-gray-900 text-sm px-4 outline-none focus:border-gray-900 transition-colors";
  const label = "block text-xs font-bold text-gray-600 mb-1.5";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-24 mt-20">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-900 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">Company Brochure</p>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">資料ダウンロード</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              以下のフォームにご記入いただくと、弊社サービス紹介資料（PDF形式）をご覧いただけます。<br />
              いただいた情報はご連絡・サービス改善以外には使用しません。
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="bg-white border border-gray-100 p-8 flex flex-col gap-6">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase border-b border-gray-100 pb-4">お客様情報</p>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={label}>お名前 <span className="text-red-500">*</span></label>
                <input required placeholder="山田 太郎" value={form.name} onChange={f("name")} className={inp} />
              </div>
              <div>
                <label className={label}>会社名 <span className="text-red-500">*</span></label>
                <input required placeholder="株式会社〇〇" value={form.company} onChange={f("company")} className={inp} />
              </div>
              <div>
                <label className={label}>メールアドレス <span className="text-red-500">*</span></label>
                <input required type="email" placeholder="email@company.com" value={form.email} onChange={f("email")} className={inp} />
              </div>
              <div>
                <label className={label}>電話番号</label>
                <input type="tel" placeholder="03-0000-0000" value={form.phone} onChange={f("phone")} className={inp} />
              </div>
              <div>
                <label className={label}>部署・役職</label>
                <input placeholder="経営企画部 部長" value={form.department} onChange={f("department")} className={inp} />
              </div>
              <div>
                <label className={label}>ご利用目的</label>
                <select value={form.purpose} onChange={f("purpose")} className={inp + " cursor-pointer"}>
                  <option value="">選択してください</option>
                  {PURPOSES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
              送信をもって<a href="/privacy" className="underline">プライバシーポリシー</a>に同意したものとみなします。
            </p>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />処理中...</>
                : <><span>資料を見る</span><ChevronRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
