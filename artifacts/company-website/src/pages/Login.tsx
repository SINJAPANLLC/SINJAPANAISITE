import { useState } from "react";
import { useLocation } from "wouter";
import { login } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      setLocation("/admin");
    } else {
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
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
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@sinjapan.jp"
              required
              className="h-11 bg-white/5 border border-white/10 text-white text-sm px-4 outline-none focus:border-white/30 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 bg-white/5 border border-white/10 text-white text-sm px-4 outline-none focus:border-white/30 transition-colors placeholder:text-gray-600"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 mt-2 bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> ログイン中...</>
            ) : (
              "ログイン"
            )}
          </button>
        </form>

        <p className="text-center mt-8">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← サイトに戻る
          </a>
        </p>

      </div>
    </div>
  );
}
