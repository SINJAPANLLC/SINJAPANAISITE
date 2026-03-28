import { useState, useEffect } from "react";
import { customerStore } from "@/hooks/use-admin-data";
import { Mail, Copy, Loader2, Sparkles, Eye, Send, Globe, Plus, Trash2 } from "lucide-react";

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
  {
    label: "見積書送付",
    subject: "【合同会社SIN JAPAN】お見積書のご送付",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもお世話になっております。\n合同会社SIN JAPANでございます。\n\n先日お話しさせていただきました件につきまして、\nお見積書を作成いたしましたのでご送付申し上げます。\n\nご不明な点やご変更のご要望がございましたら、\nお気軽にお申し付けください。\n何卒よろしくお願いいたします。`,
  },
  {
    label: "請求書送付",
    subject: "【合同会社SIN JAPAN】ご請求書のご送付",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもお世話になっております。\n合同会社SIN JAPANでございます。\n\n今月分のご請求書を送付させていただきます。\nご確認の上、お振込みいただきますようお願いいたします。\n\nご不明な点がございましたら、何なりとお申し付けください。\n引き続きどうぞよろしくお願いいたします。`,
  },
  {
    label: "代理店向け",
    subject: "【合同会社SIN JAPAN】パートナー連絡",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもご支援いただきありがとうございます。\n合同会社SIN JAPANでございます。\n\n新しいサービスのご案内とともに、最新の代理店資料をお届けいたします。\nパートナー様限定の優遇条件もご用意しておりますので、\nぜひご確認いただけますと幸いです。\n\n引き続きよろしくお願いいたします。`,
  },
];

type ContactEntry = { name: string; company: string; email: string };

function buildHtml(name: string, company: string, subject: string, body: string) {
  const bodyLines = body.split("\n");
  const bodyMain = bodyLines.slice(2).join("\n").trim().replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html lang="ja" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;">${subject}</span>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f0;">
<tr><td align="center" style="padding:40px 16px;">

<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;">

  <!-- Top 3px black rule -->
  <tr><td style="background:#000;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Header -->
  <tr>
    <td style="padding:28px 40px 24px;border-bottom:1px solid #e8e8e8;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.3em;color:#999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">合同会社 SIN JAPAN</p>
            <p style="margin:4px 0 0;font-size:9px;letter-spacing:.15em;color:#ccc;font-family:Helvetica,Arial,sans-serif;">AI INTEGRATION &amp; DEVELOPMENT</p>
          </td>
          <td align="right" style="vertical-align:middle;">
            <p style="margin:0;font-size:24px;font-weight:900;color:#000;letter-spacing:-.02em;font-family:Helvetica,Arial,sans-serif;line-height:1;">SIN</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Subject block -->
  <tr>
    <td style="padding:32px 40px 0;">
      <p style="margin:0 0 8px;font-size:9px;font-weight:700;letter-spacing:.3em;color:#bbb;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">MESSAGE</p>
      <h1 style="margin:0;font-size:19px;font-weight:900;color:#000;line-height:1.4;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${subject}</h1>
    </td>
  </tr>

  <!-- Recipient -->
  <tr>
    <td style="padding:24px 40px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:2px;background:#000;padding:0;">&nbsp;</td>
          <td style="padding:0 0 0 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#888;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${company}</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#000;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${name}&nbsp;<span style="font-size:12px;font-weight:400;color:#555;">様</span></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Rule -->
  <tr><td style="padding:0 40px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#ebebeb;font-size:0;">&nbsp;</td></tr></table></td></tr>

  <!-- Body -->
  <tr>
    <td style="padding:28px 40px 36px;">
      <p style="margin:0;font-size:14px;color:#333;line-height:2.1;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${bodyMain}</p>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 44px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td style="background:#000;padding:0;">
            <a href="mailto:info@sinjapanai.site" style="display:block;padding:14px 36px;font-size:11px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:.15em;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Contact Us &nbsp;&rsaquo;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Thin rule before footer -->
  <tr><td style="padding:0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#e0e0e0;font-size:0;">&nbsp;</td></tr></table></td></tr>

  <!-- Sender block -->
  <tr>
    <td style="padding:20px 40px;background:#fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;">合同会社SIN JAPAN　代表社員 大谷 和哉</p>
            <p style="margin:6px 0 0;font-size:10px;color:#999;line-height:1.9;font-family:Helvetica,Arial,sans-serif;">〒241-0105 神奈川県愛甲郡愛川町中津7287<br>Tel 050-5526-9906　Fax 046-212-2326<br>info@sinjapanai.site　sinjapanai.site</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#000;padding:16px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td><p style="margin:0;font-size:9px;color:#555;font-family:Helvetica,Arial,sans-serif;letter-spacing:.05em;">このメールは合同会社SIN JAPANより送信されています。</p></td>
          <td align="right"><p style="margin:0;font-size:11px;font-weight:900;color:#333;font-family:Helvetica,Arial,sans-serif;letter-spacing:.1em;">SIN JAPAN</p></td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function EmailSection() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [crawlContacts, setCrawlContacts] = useState<ContactEntry[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ContactEntry | null>(null);
  const [mode, setMode] = useState<"template" | "preview">("template");
  const [customBody, setCustomBody] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const [crawlUrl, setCrawlUrl] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<string[]>([]);
  const [crawlError, setCrawlError] = useState("");
  const [showCrawl, setShowCrawl] = useState(false);

  useEffect(() => {
    fetch("/api/contacts", { headers: { "x-admin-token": TOKEN() } })
      .then(r => r.ok ? r.json() : [])
      .then((data: ContactEntry[]) => setContacts(data.map(c => ({ name: c.name, company: c.company, email: c.email }))))
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, []);

  const customers = customerStore.getAll();
  const contactEmails = new Set([...contacts, ...crawlContacts].map(c => c.email));
  const all: ContactEntry[] = [
    ...contacts,
    ...crawlContacts,
    ...customers.filter(c => !contactEmails.has(c.email)).map(c => ({ name: c.name, company: c.company, email: c.email })),
  ];

  const tpl = TEMPLATES[templateIdx];
  const toggleAll = () => setSelected(selected.size === all.length ? new Set() : new Set(all.map(a => a.email)));
  const getBody = (a: ContactEntry) => customBody[a.email] ?? tpl.body(a.name, a.company);

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
      const html = buildHtml(a.name, a.company, tpl.subject, getBody(a));
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ to: a.email, subject: tpl.subject, html }),
      });
      setSent(prev => new Set([...prev, a.email]));
    } finally { setSending(null); }
  };

  const doCrawl = async () => {
    if (!crawlUrl.trim()) return;
    setCrawling(true); setCrawlResult([]); setCrawlError("");
    try {
      const res = await fetch("/api/crawl-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ url: crawlUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setCrawlError(data.error || "エラー"); return; }
      setCrawlResult(data.emails || []);
    } catch { setCrawlError("ネットワークエラー"); }
    finally { setCrawling(false); }
  };

  const safeHostname = (url: string) => {
    try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname; } catch { return url; }
  };

  const addCrawledEmail = (email: string) => {
    if (crawlContacts.some(c => c.email === email)) return;
    setCrawlContacts(prev => [...prev, { name: "担当者", company: safeHostname(crawlUrl), email }]);
  };

  const addAllCrawled = () => {
    const existing = new Set([...contacts, ...crawlContacts].map(c => c.email));
    const newOnes = crawlResult.filter(e => !existing.has(e))
      .map(email => ({ name: "担当者", company: safeHostname(crawlUrl), email } as ContactEntry));
    setCrawlContacts(prev => [...prev, ...newOnes]);
  };

  const html = preview ? buildHtml(preview.name, preview.company, tpl.subject, getBody(preview)) : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">メール営業</h2>
        <button onClick={() => setShowCrawl(v => !v)}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-2 border transition-colors ${showCrawl ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500 hover:text-white"}`}>
          <Globe className="w-3.5 h-3.5" /> メールクロール
        </button>
      </div>

      {/* Crawl panel */}
      {showCrawl && (
        <div className="border border-white/10 bg-white/3 p-4 flex flex-col gap-3">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">— ウェブサイトからメールアドレスを抽出</p>
          <div className="flex gap-2">
            <input value={crawlUrl} onChange={e => setCrawlUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && doCrawl()}
              placeholder="https://example.co.jp"
              className="flex-1 bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-white/30 placeholder-gray-600" />
            <button onClick={doCrawl} disabled={crawling || !crawlUrl.trim()}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors">
              {crawling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {crawling ? "クロール中…" : "クロール"}
            </button>
          </div>
          {crawlError && <p className="text-xs text-red-400">{crawlError}</p>}
          {crawlResult.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400">{crawlResult.length}件検出</p>
                <button onClick={addAllCrawled} className="text-[10px] text-white hover:text-gray-300 flex items-center gap-1 border border-white/20 px-2 py-0.5"><Plus className="w-3 h-3" />全て追加</button>
              </div>
              <div className="max-h-36 overflow-y-auto border border-white/10 divide-y divide-white/5">
                {crawlResult.map(email => {
                  const added = crawlContacts.some(c => c.email === email);
                  return (
                    <div key={email} className="flex items-center justify-between px-3 py-1.5">
                      <span className="text-xs text-gray-300 font-mono truncate flex-1">{email}</span>
                      <button onClick={() => addCrawledEmail(email)} disabled={added}
                        className={`text-[10px] px-2 py-0.5 ml-2 flex-shrink-0 border transition-colors ${added ? "border-white/10 text-gray-600 cursor-default" : "border-white/20 text-white hover:bg-white/5"}`}>
                        {added ? "追加済" : "追加"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {crawlContacts.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">追加済み（{crawlContacts.length}件）</p>
              <div className="flex flex-col gap-1">
                {crawlContacts.map(c => (
                  <div key={c.email} className="flex items-center justify-between bg-white/3 border border-white/5 px-3 py-1.5">
                    <span className="text-xs text-gray-400 font-mono truncate">{c.email}</span>
                    <button onClick={() => setCrawlContacts(prev => prev.filter(x => x.email !== c.email))}
                      className="text-gray-600 hover:text-red-400 ml-2 flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        {/* Left */}
        <div className="col-span-2 flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">テンプレート</p>
            <div className="flex flex-col gap-1.5">
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
              {loadingContacts && <div className="flex justify-center p-6"><Loader2 className="w-4 h-4 animate-spin text-gray-600" /></div>}
              {!loadingContacts && all.length === 0 && <p className="text-xs text-gray-600 p-4 text-center">連絡先がありません</p>}
              {!loadingContacts && all.map(a => (
                <label key={a.email} className="flex items-center gap-3 px-3 py-2 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => { setPreview(a); setMode("template"); }}>
                  <input type="checkbox" checked={selected.has(a.email)} onChange={e => {
                    const s = new Set(selected);
                    e.target.checked ? s.add(a.email) : s.delete(a.email);
                    setSelected(s);
                  }} className="accent-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{a.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                  </div>
                  {sent.has(a.email) && <span className="text-[10px] text-green-400">送済</span>}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-3 flex flex-col gap-3">
          {preview ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">— {preview.name}様</p>
                <div className="flex gap-2">
                  <button onClick={() => setMode("template")}
                    className={`text-[10px] px-2 py-1 border transition-colors ${mode === "template" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500"}`}>編集</button>
                  <button onClick={() => setMode("preview")}
                    className={`text-[10px] px-2 py-1 border transition-colors flex items-center gap-1 ${mode === "preview" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500"}`}>
                    <Eye className="w-3 h-3" /> HTML
                  </button>
                </div>
              </div>

              {mode === "template" && (
                <div className="flex flex-col gap-3">
                  <div className="bg-white/5 border border-white/10 px-3 py-2">
                    <p className="text-[10px] text-gray-500">件名：<span className="text-white">{tpl.subject}</span></p>
                  </div>
                  <textarea value={getBody(preview)}
                    onChange={e => setCustomBody({ ...customBody, [preview.email]: e.target.value })}
                    className="w-full min-h-[200px] bg-white/5 border border-white/10 text-sm text-gray-300 p-3 outline-none resize-none font-sans leading-relaxed focus:border-white/30" />
                  <button onClick={aiCompose} disabled={aiGenerating}
                    className="flex items-center gap-2 text-xs text-yellow-400 border border-yellow-400/30 px-3 py-2 hover:bg-yellow-400/5 transition-colors disabled:opacity-60 self-start">
                    {aiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    AIで最適化
                  </button>
                </div>
              )}

              {mode === "preview" && (
                <iframe srcDoc={html} className="w-full min-h-[400px] border border-white/10" title="preview" />
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => sendMail(preview)} disabled={!!sending}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 disabled:opacity-60 transition-colors">
                  {sending === preview.email ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {sent.has(preview.email) ? "再送信" : "送信"}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(`件名: ${tpl.subject}\n\n${getBody(preview)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-2">
                  <Copy className="w-3.5 h-3.5" /> {copied ? "コピー完了" : "コピー"}
                </button>
              </div>
            </>
          ) : (
            <div className="border border-white/10 flex items-center justify-center h-48">
              <p className="text-xs text-gray-600">送信先を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
