import { useState, useEffect } from "react";
import { customerStore } from "@/hooks/use-admin-data";
import { Mail, Copy, Loader2, Sparkles, Eye, Send, X } from "lucide-react";

const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

const TEMPLATES = [
  {
    label: "初回アプローチ",
    subject: "【合同会社SIN JAPAN】AI導入支援のご提案",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nはじめてご連絡させていただきます。\n合同会社SIN JAPANと申します。\n\n弊社は、AI導入支援・AI開発を専門とした会社です。\n貴社のビジネス課題をAIで解決するご提案が可能です。\n\n一度、オンラインにてご説明の機会をいただけますでしょうか。\n\nどうぞよろしくお願いいたします。`,
  },
  {
    label: "フォローアップ",
    subject: "【合同会社SIN JAPAN】先日のご提案の件",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nお世話になっております。\n合同会社SIN JAPANです。\n\n先日ご提案させていただいた件について、\nご検討いただけましたでしょうか？\n\nご不明な点がございましたら、お気軽にご連絡ください。`,
  },
  {
    label: "お礼メール",
    subject: "【合同会社SIN JAPAN】お問い合わせいただきありがとうございます",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n合同会社SIN JAPANです。\n\n担当者より改めてご連絡させていただきます。\n今しばらくお待ちいただけますようお願い申し上げます。`,
  },
];

type ContactEntry = { name: string; company: string; email: string };

function buildHtml(name: string, company: string, subject: string, body: string) {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:40px;">
<p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 24px;">合同会社SIN JAPAN</p>
<h1 style="font-size:18px;font-weight:900;color:#111827;margin:0 0 24px;">${subject}</h1>
<p style="font-size:14px;color:#374151;margin:0 0 4px;">${company}</p>
<p style="font-size:14px;color:#374151;margin:0 0 16px;">${name} 様</p>
<div style="font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap;margin:0 0 32px;">${body.replace(/^.*\n.*\n/, "")}</div>
<div style="background:#111827;color:#fff;padding:20px;">
<p style="font-size:12px;font-weight:900;margin:0 0 8px;">合同会社SIN JAPAN</p>
<p style="font-size:11px;color:#9ca3af;margin:0;line-height:1.8;">Tel: 050-5526-9906 / info@sinjapanai.site</p>
</div></div></body></html>`;
}

export function EmailSection() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ContactEntry | null>(null);
  const [mode, setMode] = useState<"template" | "preview" | "ai">("template");
  const [customBody, setCustomBody] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/contacts", { headers: { "x-admin-token": TOKEN() } })
      .then(r => r.ok ? r.json() : [])
      .then((data: ContactEntry[]) => setContacts(data.map(c => ({ name: c.name, company: c.company, email: c.email }))))
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, []);

  const customers = customerStore.getAll();
  const contactEmails = new Set(contacts.map(c => c.email));
  const all: ContactEntry[] = [...contacts, ...customers.filter(c => !contactEmails.has(c.email)).map(c => ({ name: c.name, company: c.company, email: c.email }))];

  const tpl = TEMPLATES[templateIdx];
  const toggleAll = () => setSelected(selected.size === all.length ? new Set() : new Set(all.map(a => a.email)));

  const getBody = (a: ContactEntry) => customBody[a.email] ?? tpl.body(a.name, a.company);
  const getSubject = () => tpl.subject;

  const aiCompose = async () => {
    if (!preview) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/compose-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ name: preview.name, company: preview.company, templateType: tpl.label }),
      });
      const { body } = await res.json();
      setCustomBody({ ...customBody, [preview.email]: body });
    } finally { setAiGenerating(false); }
  };

  const sendMail = async (a: ContactEntry) => {
    setSending(a.email);
    try {
      const html = buildHtml(a.name, a.company, getSubject(), getBody(a));
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ to: a.email, subject: getSubject(), html }),
      });
      setSent(prev => new Set([...prev, a.email]));
    } finally { setSending(null); }
  };

  const html = preview ? buildHtml(preview.name, preview.company, getSubject(), getBody(preview)) : "";

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-black">メール営業</h2>
      <div className="grid grid-cols-5 gap-6">
        {/* Left: template + list */}
        <div className="col-span-2 flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">テンプレート選択</p>
            <div className="flex flex-col gap-2">
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setTemplateIdx(i)}
                  className={`text-left px-3 py-2 border text-xs font-bold transition-colors ${templateIdx === i ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-gray-500 hover:text-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">送信先（{loadingContacts ? "…" : all.length}件）</p>
              <button onClick={toggleAll} className="text-[10px] text-gray-400 hover:text-white">{selected.size === all.length ? "全解除" : "全選択"}</button>
            </div>
            <div className="border border-white/10 max-h-60 overflow-y-auto">
              {loadingContacts && <div className="flex items-center justify-center p-6 gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /></div>}
              {!loadingContacts && all.length === 0 && <p className="text-xs text-gray-600 p-4 text-center">連絡先がありません</p>}
              {!loadingContacts && all.map(a => (
                <label key={a.email} className="flex items-center gap-3 px-3 py-2 border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => { setPreview(a); setMode("template"); }}>
                  <input type="checkbox" checked={selected.has(a.email)} onChange={e => {
                    const s = new Set(selected);
                    e.target.checked ? s.add(a.email) : s.delete(a.email);
                    setSelected(s);
                  }} className="accent-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{a.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                  </div>
                  {sent.has(a.email) && <span className="text-[10px] text-green-400 flex-shrink-0">送信済</span>}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: preview + edit + send */}
        <div className="col-span-3 flex flex-col gap-3">
          {preview ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">— {preview.name}様</p>
                <div className="flex gap-2">
                  <button onClick={() => setMode("template")}
                    className={`text-[10px] px-2 py-1 border transition-colors ${mode === "template" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500"}`}>
                    編集
                  </button>
                  <button onClick={() => setMode("preview")}
                    className={`text-[10px] px-2 py-1 border transition-colors flex items-center gap-1 ${mode === "preview" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500"}`}>
                    <Eye className="w-3 h-3" /> プレビュー
                  </button>
                </div>
              </div>

              {mode === "template" && (
                <div className="flex flex-col gap-3">
                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-gray-500 mb-1">件名：<span className="text-white">{tpl.subject}</span></p>
                  </div>
                  <textarea
                    value={getBody(preview)}
                    onChange={e => setCustomBody({ ...customBody, [preview.email]: e.target.value })}
                    className="w-full min-h-[200px] bg-white/5 border border-white/10 text-sm text-gray-300 p-3 outline-none resize-none font-sans leading-relaxed focus:border-white/30"
                  />
                  <button onClick={aiCompose} disabled={aiGenerating}
                    className="flex items-center gap-2 text-xs text-yellow-400 border border-yellow-400/30 px-3 py-2 hover:bg-yellow-400/5 transition-colors disabled:opacity-60 self-start">
                    {aiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AIで文章を最適化
                  </button>
                </div>
              )}

              {mode === "preview" && (
                <iframe srcDoc={html} className="w-full min-h-[320px] bg-white border border-white/10" title="preview" />
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => sendMail(preview)} disabled={!!sending}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 disabled:opacity-60">
                  {sending === preview.email ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {sent.has(preview.email) ? "再送信" : "このアドレスに送信"}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(`件名: ${tpl.subject}\n\n${getBody(preview)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-2">
                  <Copy className="w-3.5 h-3.5" /> {copied ? "コピー完了" : "コピー"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 border border-white/10 flex items-center justify-center h-48">
              <p className="text-xs text-gray-600">左から送信先を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
