import { useState, useEffect } from "react";
import { Mail, Building2, User, MessageSquare, Clock, Loader2, RefreshCw, Send, Eye, X } from "lucide-react";

type Contact = { id: number; name: string; company: string; email: string; message: string; createdAt: string };

const fmtDate = (iso: string) => new Date(iso).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

function buildReplyHtml(name: string, subject: string, body: string) {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:40px;">
<p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 24px;">合同会社SIN JAPAN</p>
<h1 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 24px;">${subject}</h1>
<p style="font-size:14px;color:#374151;margin:0 0 8px;">${name} 様</p>
<div style="font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap;margin:16px 0 32px;">${body}</div>
<div style="background:#111827;color:#fff;padding:20px;margin-top:32px;">
<p style="font-size:12px;font-weight:900;margin:0 0 8px;">合同会社SIN JAPAN</p>
<p style="font-size:11px;color:#9ca3af;margin:0;line-height:1.8;">Tel: 050-5526-9906 / info@sinjapanai.site</p>
</div></div></body></html>`;
}

function ReplyModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [subject, setSubject] = useState(`Re: お問い合わせいただきありがとうございます`);
  const [body, setBody] = useState(`${contact.name} 様\n\nお問い合わせいただき、誠にありがとうございます。\n合同会社SIN JAPANです。\n\n`);
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const html = buildReplyHtml(contact.name, subject, body);

  const send = async () => {
    setSending(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ to: contact.email, subject, html }),
      });
      setSent(true);
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-black">返信 — {contact.name} 様 ({contact.email})</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
        </div>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
            <Send className="w-8 h-8 text-green-400" />
            <p className="font-bold text-green-400">送信完了しました</p>
            <button onClick={onClose} className="text-xs text-gray-400 underline">閉じる</button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="flex border-b border-white/10">
              <button onClick={() => setPreview(false)}
                className={`px-5 py-3 text-xs font-bold transition-colors ${!preview ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-white"}`}>
                編集
              </button>
              <button onClick={() => setPreview(true)}
                className={`px-5 py-3 text-xs font-bold flex items-center gap-1.5 transition-colors ${preview ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-white"}`}>
                <Eye className="w-3.5 h-3.5" /> プレビュー
              </button>
            </div>

            {!preview ? (
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block tracking-widest">件名</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none focus:border-white/30" />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] text-gray-500 mb-1 block tracking-widest">本文</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)}
                    className="flex-1 min-h-[240px] bg-white/10 border border-white/10 text-white text-sm p-3 outline-none resize-none leading-relaxed focus:border-white/30" />
                </div>
                <div className="text-[10px] text-gray-600 bg-white/5 border border-white/10 px-3 py-2">
                  <p style={{ whiteSpace: "pre-line" }}>
                    {`合同会社SIN JAPAN\ninfo@sinjapanai.site / 050-5526-9906`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4">
                <iframe srcDoc={html} className="w-full h-full min-h-[400px] bg-white border-0" title="email preview" />
              </div>
            )}
          </div>
        )}

        {!sent && (
          <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
            <button onClick={onClose} className="text-xs text-gray-500 hover:text-white px-4 py-2">キャンセル</button>
            <button onClick={send} disabled={sending}
              className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-5 py-2 hover:bg-gray-100 disabled:opacity-60">
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              送信する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [replying, setReplying] = useState<Contact | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetch("/api/contacts", { headers: { "x-admin-token": TOKEN() } }).then(r => r.json());
      setContacts(data);
    } catch { setError("データの取得に失敗しました"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col gap-6">
      {replying && <ReplyModal contact={replying} onClose={() => setReplying(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">お問い合わせ</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{contacts.length}件</span>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-40">
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> 更新
          </button>
        </div>
      </div>

      {loading && <div className="flex items-center justify-center h-40 gap-2 text-gray-600"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-xs">読み込み中...</span></div>}
      {error && <div className="flex flex-col items-center justify-center h-40 gap-2"><p className="text-xs text-red-400">{error}</p><button onClick={load} className="text-xs text-gray-500 underline">再試行</button></div>}

      {!loading && !error && (
        <div className="flex gap-6">
          <div className="w-80 border border-white/10 flex-shrink-0 overflow-y-auto max-h-[600px]">
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2"><Mail className="w-8 h-8 text-gray-700" /><p className="text-xs text-gray-600">まだお問い合わせはありません</p></div>
            ) : contacts.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selected?.id === c.id ? "bg-white/10" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm font-bold truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-600 flex-shrink-0 font-mono">{fmtDate(c.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.company}</p>
                <p className="text-xs text-gray-600 truncate mt-1">{c.message}</p>
              </button>
            ))}
          </div>

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
                      <div><p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">{label}</p><p className="text-sm font-bold">{val}</p></div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div><p className="text-[10px] text-gray-500 tracking-widest uppercase mb-0.5">お問い合わせ内容</p><p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p></div>
                  </div>
                </div>
                <button onClick={() => setReplying(selected)}
                  className="inline-flex items-center gap-2 h-9 px-5 bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors self-start">
                  <Send className="w-3.5 h-3.5" /> このアプリで返信する
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 gap-2"><MessageSquare className="w-8 h-8 text-gray-700" /><p className="text-xs text-gray-600">左のリストから選択してください</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
