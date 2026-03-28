import { useState } from "react";
import { visitorLogStore, type VisitorLog } from "@/hooks/use-admin-data";
import { Trash2, Monitor, Smartphone } from "lucide-react";

const isPhone = (ua: string) => /mobile|android|iphone|ipad/i.test(ua);
const fmtTime = (ts: number) => new Date(ts).toLocaleString("ja-JP");
const shorten = (ua: string) => {
  if (/Chrome\//.test(ua) && !/Chromium|Edge/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/Edg\//.test(ua)) return "Edge";
  return "その他";
};

export function UserLogSection() {
  const [logs, setLogs] = useState<VisitorLog[]>(() => visitorLogStore.getAll());

  const clear = () => {
    localStorage.removeItem("sj_visitor_log");
    setLogs([]);
  };

  const byPage = logs.reduce((acc: Record<string, number>, l) => {
    acc[l.path] = (acc[l.path] || 0) + 1;
    return acc;
  }, {});

  const byBrowser = logs.reduce((acc: Record<string, number>, l) => {
    const b = shorten(l.userAgent);
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const phoneCount = logs.filter(l => isPhone(l.userAgent)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">ユーザーログ</h2>
        {logs.length > 0 && (
          <button onClick={clear} className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> ログをクリア
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">総訪問数</p>
          <p className="text-2xl font-black">{logs.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">ページ数</p>
          <p className="text-2xl font-black">{Object.keys(byPage).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-3">
          <Monitor className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">PC</p>
            <p className="text-2xl font-black">{logs.length - phoneCount}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">スマホ</p>
            <p className="text-2xl font-black">{phoneCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">訪問履歴</p>
          <div className="border border-white/10">
            <div className="grid grid-cols-4 px-3 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
              <span className="col-span-2">ページ</span><span>ブラウザ</span><span className="text-right">日時</span>
            </div>
            {logs.length === 0 && <div className="py-12 text-center text-xs text-gray-600">訪問データがありません。<br />サイトを閲覧するとデータが蓄積されます。</div>}
            {logs.slice(0, 100).map(l => (
              <div key={l.id} className="grid grid-cols-4 px-3 py-2 border-b border-white/5 text-xs hover:bg-white/5">
                <span className="col-span-2 text-gray-300 truncate">{l.path || "/"}</span>
                <span className="text-gray-500 flex items-center gap-1">
                  {isPhone(l.userAgent) ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                  {shorten(l.userAgent)}
                </span>
                <span className="text-gray-600 text-right font-mono">{fmtTime(l.ts)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">ページ別訪問数</p>
          <div className="flex flex-col gap-2">
            {Object.entries(byPage).sort((a, b) => b[1] - a[1]).map(([page, count]) => (
              <div key={page} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 truncate flex-1">{page || "/"}</span>
                <span className="font-black ml-2 flex-shrink-0">{count}</span>
              </div>
            ))}
            {Object.keys(byPage).length === 0 && <p className="text-xs text-gray-600">データなし</p>}
          </div>

          <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3 mt-6">ブラウザ別</p>
          <div className="flex flex-col gap-2">
            {Object.entries(byBrowser).sort((a, b) => b[1] - a[1]).map(([b, count]) => (
              <div key={b} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{b}</span>
                <span className="font-black">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
