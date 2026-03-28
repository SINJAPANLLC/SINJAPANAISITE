import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Monitor, Smartphone, Tablet, Globe, MapPin, Trash2, Activity } from "lucide-react";

type Log = {
  id: number; path: string; title: string | null; ip: string | null;
  country: string | null; countryCode: string | null; region: string | null; city: string | null;
  userAgent: string | null; browser: string | null; device: string | null;
  referrer: string | null; sessionId: string | null; timeOnPage: number | null; createdAt: string;
};

const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";
const fmtDate = (iso: string) => new Date(iso).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

function DeviceIcon({ d }: { d: string | null }) {
  if (d === "スマートフォン") return <Smartphone className="w-3.5 h-3.5 text-gray-400" />;
  if (d === "タブレット") return <Tablet className="w-3.5 h-3.5 text-gray-400" />;
  return <Monitor className="w-3.5 h-3.5 text-gray-400" />;
}

export function UserLogSection() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/track", { headers: { "x-admin-token": TOKEN() } }).then(r => r.ok ? r.json() : []);
      setLogs(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const byPage = logs.reduce((acc: Record<string, number>, l) => { acc[l.path] = (acc[l.path] || 0) + 1; return acc; }, {});
  const byCountry = logs.reduce((acc: Record<string, number>, l) => { const k = l.country || "不明"; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const byBrowser = logs.reduce((acc: Record<string, number>, l) => { const k = l.browser || "不明"; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const byDevice = logs.reduce((acc: Record<string, number>, l) => { const k = l.device || "不明"; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  const phones = logs.filter(l => l.device === "スマートフォン").length;
  const tablets = logs.filter(l => l.device === "タブレット").length;
  const uniqueIps = new Set(logs.map(l => l.ip)).size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">ユーザーログ</h2>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> 更新
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "総訪問数", val: logs.length },
              { label: "ユニークIP", val: uniqueIps },
              { label: "PC", val: logs.length - phones - tablets },
              { label: "スマートフォン", val: phones },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 border border-white/10 p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black">{val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Log table */}
            <div className="col-span-2">
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">訪問履歴</p>
              <div className="border border-white/10 overflow-auto max-h-80">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 text-[10px] tracking-widest">
                      <th className="text-left px-3 py-2">ページ</th>
                      <th className="text-left px-3 py-2">場所</th>
                      <th className="text-left px-3 py-2">デバイス</th>
                      <th className="text-left px-3 py-2">ブラウザ</th>
                      <th className="text-right px-3 py-2">日時</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-10 text-gray-600">データがありません<br /><span className="text-[10px]">サイトを閲覧するとデータが蓄積されます</span></td></tr>
                    )}
                    {logs.map(l => (
                      <tr key={l.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-3 py-2 text-gray-300 max-w-[120px] truncate">{l.path || "/"}</td>
                        <td className="px-3 py-2 text-gray-400">
                          {l.city || l.country ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {[l.city, l.country].filter(Boolean).join(", ")}
                            </span>
                          ) : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="px-3 py-2 text-gray-400">
                          <span className="flex items-center gap-1"><DeviceIcon d={l.device} />{l.device || "—"}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-400">{l.browser || "—"}</td>
                        <td className="px-3 py-2 text-gray-600 text-right font-mono">{fmtDate(l.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right sidebar stats */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> 国別
                </p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 truncate flex-1">{k}</span>
                      <span className="font-black ml-2 flex-shrink-0">{v}</span>
                    </div>
                  ))}
                  {Object.keys(byCountry).length === 0 && <p className="text-xs text-gray-600">データなし</p>}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">ページ別</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 truncate flex-1 max-w-[120px]">{k || "/"}</span>
                      <span className="font-black ml-2 flex-shrink-0">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">ブラウザ別</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(byBrowser).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-black ml-2">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">デバイス別</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(byDevice).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{k}</span>
                      <span className="font-black ml-2">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
