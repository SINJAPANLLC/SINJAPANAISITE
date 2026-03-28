import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { isAuthenticated, logout, login } from "@/hooks/use-auth";
import { RevenueSection } from "@/components/admin/RevenueSection";
import { CustomerSection } from "@/components/admin/CustomerSection";
import { EstimateSection } from "@/components/admin/EstimateSection";
import { InvoiceSection } from "@/components/admin/InvoiceSection";
import { SeoSection } from "@/components/admin/SeoSection";
import { EmailSection } from "@/components/admin/EmailSection";
import { UserLogSection } from "@/components/admin/UserLogSection";
import { NewsSection } from "@/components/admin/NewsSection";
import { ContactSection } from "@/components/admin/ContactSection";
import { DownloadLeadSection } from "@/components/admin/DownloadLeadSection";
import { AgencySection } from "@/components/admin/AgencySection";
import { Loader2, LogOut, TrendingUp, Users, FileText, Receipt, Search, Mail, Activity, Bell, MessageSquare, Download, Handshake } from "lucide-react";

const NAV = [
  { key: "revenue",   label: "収益",          Icon: TrendingUp },
  { key: "customers", label: "顧客管理",       Icon: Users },
  { key: "estimates", label: "見積もり",       Icon: FileText },
  { key: "invoices",  label: "請求書発行",     Icon: Receipt },
  { key: "seo",       label: "SEO記事生成",    Icon: Search },
  { key: "email",     label: "メール営業",     Icon: Mail },
  { key: "userlog",   label: "ユーザーログ",   Icon: Activity },
  { key: "news",      label: "お知らせ",       Icon: Bell },
  { key: "contact",   label: "お問い合わせ",   Icon: MessageSquare },
  { key: "downloads", label: "資料DLリード",   Icon: Download },
  { key: "agency",    label: "代理店管理",     Icon: Handshake },
] as const;

type NavKey = typeof NAV[number]["key"];

// ── Login Form ──────────────────────────────────────────────────
function LoginForm() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) setLocation("/admin");
    else setError("メールアドレスまたはパスワードが正しくありません。");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase mb-3">Admin</p>
          <h1 className="text-2xl font-black text-white">管理者ログイン</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">メールアドレス</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@sinjapan.jp" required
              className="h-11 bg-white/5 border border-white/10 text-white text-sm px-4 outline-none focus:border-white/30 transition-colors placeholder:text-gray-600" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">パスワード</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              className="h-11 bg-white/5 border border-white/10 text-white text-sm px-4 outline-none focus:border-white/30 transition-colors placeholder:text-gray-600" />
          </div>
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="h-11 mt-2 bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> ログイン中...</> : "ログイン"}
          </button>
        </form>
        <p className="text-center mt-8">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← サイトに戻る</a>
        </p>
      </div>
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────
function Dashboard() {
  const [, setLocation] = useLocation();
  const [active, setActive] = useState<NavKey>("revenue");

  const handleLogout = () => { logout(); setLocation("/admin"); };

  const renderSection = () => {
    switch (active) {
      case "revenue":   return <RevenueSection />;
      case "customers": return <CustomerSection />;
      case "estimates": return <EstimateSection />;
      case "invoices":  return <InvoiceSection />;
      case "seo":       return <SeoSection />;
      case "email":     return <EmailSection />;
      case "userlog":   return <UserLogSection />;
      case "news":      return <NewsSection />;
      case "contact":   return <ContactSection />;
      case "downloads": return <DownloadLeadSection />;
      case "agency":    return <AgencySection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-52 border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[9px] font-bold tracking-[0.25em] text-gray-600 uppercase mb-0.5">Admin</p>
          <p className="text-sm font-black text-white">SIN JAPAN</p>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setActive(key)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold transition-colors ${active === key ? "bg-white/10 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 flex flex-col gap-2">
          <a href="/" className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">← サイトを見る</a>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-red-400 transition-colors">
            <LogOut className="w-3 h-3" /> ログアウト
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {renderSection()}
      </main>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────
export default function Admin() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  if (auth === null) return null;
  if (!auth) return <LoginForm />;
  return <Dashboard />;
}
