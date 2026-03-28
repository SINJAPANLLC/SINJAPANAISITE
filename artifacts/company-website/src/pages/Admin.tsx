import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { isAuthenticated, logout } from "@/hooks/use-auth";
import { getContacts } from "@/hooks/use-contact";
import { LogOut, Mail, Building2, User, MessageSquare, Clock } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
      return;
    }
    setContacts(getContacts());
  }, [setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Admin</span>
          <span className="text-sm font-black">SIN JAPAN 管理画面</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">サイトを見る</a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            ログアウト
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-b border-white/10 px-6 py-4 flex gap-8">
        <div>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">お問い合わせ件数</p>
          <p className="text-2xl font-black">{contacts.length}</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* List */}
        <div className="w-full md:w-96 border-r border-white/10 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-bold text-gray-400 tracking-wider">お問い合わせ一覧</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <Mail className="w-8 h-8 text-gray-700" />
                <p className="text-xs text-gray-600">まだお問い合わせはありません</p>
              </div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selected?.id === c.id ? "bg-white/10" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-bold truncate">{c.name}</span>
                    <span className="text-[10px] text-gray-600 flex-shrink-0">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.company}</p>
                  <p className="text-xs text-gray-600 truncate mt-1">{c.message}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto p-8">
          {selected ? (
            <div className="max-w-xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">お問い合わせ詳細</h2>
                <span className="text-[10px] text-gray-500 font-mono">{formatDate(selected.createdAt)}</span>
              </div>

              <div className="flex flex-col gap-4 bg-white/5 border border-white/10 p-6">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">お名前</p>
                    <p className="text-sm font-bold">{selected.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">会社名</p>
                    <p className="text-sm font-bold">{selected.company}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">メールアドレス</p>
                    <a href={`mailto:${selected.email}`} className="text-sm font-bold hover:text-gray-300 transition-colors">
                      {selected.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">お問い合わせ内容</p>
                    <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">受信日時</p>
                    <p className="text-sm font-bold">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: お問い合わせいただきありがとうございます&body=`}
                className="inline-flex items-center gap-2 h-10 px-5 bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors self-start"
              >
                <Mail className="w-3.5 h-3.5" />
                返信する
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <MessageSquare className="w-10 h-10 text-gray-700" />
              <p className="text-sm text-gray-600">左のリストからお問い合わせを選択してください</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
