import { useState, useEffect } from "react";
import { customerStore } from "@/hooks/use-admin-data";
import { Mail, Copy, Loader2, Sparkles, Eye, Send, X, Globe, Plus, Trash2 } from "lucide-react";

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
  const bodyLines = body.split("\n");
  const bodyMain = bodyLines.slice(2).join("\n").trim().replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html lang="ja" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:#0d0d0d;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${subject} — 合同会社SIN JAPAN</span>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;min-height:100vh;">
<tr><td align="center" style="padding:32px 16px;">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- ===== HEADER ===== -->
  <tr>
    <td style="background:#000000;padding:0;border-top:none;">
      <!-- Accent line: cyan + blue gradient via 2 cells -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="80" style="height:3px;background:#00e5ff;font-size:0;line-height:0;">&nbsp;</td>
          <td style="height:3px;background:linear-gradient(90deg,#00e5ff,#0066ff);font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
      <!-- Logo row -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:0;">
        <tr>
          <td style="padding:22px 32px 22px 32px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:12px;vertical-align:middle;">
                  <!-- S mark -->
                  <div style="width:44px;height:44px;background:#00e5ff;text-align:center;line-height:44px;font-size:22px;font-weight:900;color:#000;font-family:Arial,sans-serif;letter-spacing:-.02em;">S</div>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:16px;font-weight:900;color:#ffffff;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;letter-spacing:.05em;">SIN JAPAN AI</p>
                  <p style="margin:2px 0 0;font-size:10px;font-weight:400;color:#555;font-family:Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;">AI INTEGRATION &amp; DEVELOPMENT</p>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="padding:22px 32px 22px 0;vertical-align:middle;">
            <p style="margin:0;font-size:10px;color:#333;font-family:Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;">合同会社</p>
            <p style="margin:2px 0 0;font-size:11px;font-weight:700;color:#444;font-family:Arial,sans-serif;">SIN JAPAN</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ===== SUBJECT BANNER ===== -->
  <tr>
    <td style="background:#00e5ff;padding:10px 32px;">
      <p style="margin:0;font-size:12px;font-weight:900;color:#000;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;letter-spacing:.03em;">${subject}</p>
    </td>
  </tr>

  <!-- ===== BODY ===== -->
  <tr>
    <td style="background:#ffffff;padding:40px 32px 32px;">

      <!-- Recipient -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td width="4" style="background:#00e5ff;">&nbsp;</td>
          <td style="background:#f4f4f4;padding:14px 18px;">
            <p style="margin:0;font-size:12px;font-weight:700;color:#666;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${company}</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#000;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${name}&nbsp;<span style="font-size:13px;font-weight:400;">様</span></p>
          </td>
        </tr>
      </table>

      <!-- Body text -->
      <p style="margin:0 0 28px;font-size:14px;line-height:2;color:#333;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${bodyMain}</p>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="background:#000;padding:14px 36px;text-align:center;">
            <a href="mailto:info@sinjapanai.site" style="font-size:13px;font-weight:900;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;letter-spacing:.08em;display:block;">お問い合わせはこちら&nbsp;→</a>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:36px;">
        <tr>
          <td width="80" style="height:1px;background:#00e5ff;font-size:0;">&nbsp;</td>
          <td style="height:1px;background:#eee;font-size:0;">&nbsp;</td>
        </tr>
      </table>

      <!-- Sender sig -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
        <tr>
          <td>
            <p style="margin:0;font-size:13px;font-weight:900;color:#000;font-family:Arial,'Hiragino Kaku Gothic ProN',sans-serif;">合同会社SIN JAPAN</p>
            <p style="margin:4px 0 0;font-size:12px;color:#888;font-family:Arial,sans-serif;line-height:1.8;">
              代表社員 大谷 和哉<br>
              TEL: 050-5526-9906&nbsp;&nbsp;|&nbsp;&nbsp;FAX: 046-212-2326<br>
              <a href="mailto:info@sinjapanai.site" style="color:#00a0c0;text-decoration:none;">info@sinjapanai.site</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://sinjapanai.site" style="color:#00a0c0;text-decoration:none;">sinjapanai.site</a>
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- ===== FOOTER ===== -->
  <tr>
    <td style="background:#111;padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;color:#555;font-family:Arial,sans-serif;line-height:1.8;">
              〒241-0105 神奈川県愛甲郡愛川町中津7287<br>
              このメールは合同会社SIN JAPANより送信されています。
            </p>
          </td>
          <td align="right" style="vertical-align:top;">
            <p style="margin:0;font-size:9px;color:#333;font-family:Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;">SIN JAPAN</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom accent line -->
  <tr>
    <td style="padding:0;font-size:0;line-height:0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="height:2px;background:#00e5ff;width:80px;font-size:0;">&nbsp;</td>
          <td style="height:2px;background:#0066ff;font-size:0;">&nbsp;</td>
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
  const [mode, setMode] = useState<"template" | "preview" | "ai">("template");
  const [customBody, setCustomBody] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Crawl state
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

  const doCrawl = async () => {
    if (!crawlUrl.trim()) return;
    setCrawling(true);
    setCrawlResult([]);
    setCrawlError("");
    try {
      const res = await fetch("/api/crawl-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ url: crawlUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setCrawlError(data.error || "エラーが発生しました"); return; }
      setCrawlResult(data.emails || []);
    } catch { setCrawlError("ネットワークエラー"); }
    finally { setCrawling(false); }
  };

  const addCrawledEmail = (email: string) => {
    if (crawlContacts.some(c => c.email === email)) return;
    const entry: ContactEntry = { name: "担当者", company: new URL(crawlUrl.startsWith("http") ? crawlUrl : `https://${crawlUrl}`).hostname, email };
    setCrawlContacts(prev => [...prev, entry]);
  };

  const addAllCrawled = () => {
    const existing = new Set([...contacts, ...crawlContacts].map(c => c.email));
    const newOnes = crawlResult
      .filter(e => !existing.has(e))
      .map(email => ({ name: "担当者", company: new URL(crawlUrl.startsWith("http") ? crawlUrl : `https://${crawlUrl}`).hostname, email } as ContactEntry));
    setCrawlContacts(prev => [...prev, ...newOnes]);
  };

  const removeCrawlContact = (email: string) => setCrawlContacts(prev => prev.filter(c => c.email !== email));

  const html = preview ? buildHtml(preview.name, preview.company, getSubject(), getBody(preview)) : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">メール営業</h2>
        <button
          onClick={() => setShowCrawl(v => !v)}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-2 border transition-colors ${showCrawl ? "border-cyan-400/50 text-cyan-400 bg-cyan-400/5" : "border-white/10 text-gray-500 hover:text-white"}`}
        >
          <Globe className="w-3.5 h-3.5" /> メールクロール
        </button>
      </div>

      {/* Crawl panel */}
      {showCrawl && (
        <div className="border border-cyan-400/20 bg-cyan-400/3 p-4 flex flex-col gap-3">
          <p className="text-[10px] text-cyan-400/70 tracking-widest uppercase font-bold">— ウェブサイトからメールアドレスを抽出</p>
          <div className="flex gap-2">
            <input
              value={crawlUrl}
              onChange={e => setCrawlUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doCrawl()}
              placeholder="https://example.co.jp または example.co.jp"
              className="flex-1 bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-cyan-400/50 placeholder-gray-600"
            />
            <button
              onClick={doCrawl}
              disabled={crawling || !crawlUrl.trim()}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {crawling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {crawling ? "クロール中…" : "クロール"}
            </button>
          </div>

          {crawlError && <p className="text-xs text-red-400">{crawlError}</p>}

          {crawlResult.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400">{crawlResult.length}件のメールアドレスを検出</p>
                <button onClick={addAllCrawled} className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Plus className="w-3 h-3" />全て追加</button>
              </div>
              <div className="max-h-40 overflow-y-auto border border-white/10 divide-y divide-white/5">
                {crawlResult.map(email => {
                  const added = crawlContacts.some(c => c.email === email);
                  return (
                    <div key={email} className="flex items-center justify-between px-3 py-1.5">
                      <span className="text-xs text-gray-300 font-mono">{email}</span>
                      <button
                        onClick={() => addCrawledEmail(email)}
                        disabled={added}
                        className={`text-[10px] px-2 py-0.5 border transition-colors ${added ? "border-green-400/30 text-green-400 cursor-default" : "border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/5"}`}
                      >
                        {added ? "追加済" : "追加"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {crawlResult.length === 0 && !crawling && crawlUrl && !crawlError && (
            <p className="text-xs text-gray-600">URLを入力してクロールボタンを押してください</p>
          )}

          {/* Crawl-added contacts */}
          {crawlContacts.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">クロール追加済み（{crawlContacts.length}件）</p>
              <div className="flex flex-col gap-1">
                {crawlContacts.map(c => (
                  <div key={c.email} className="flex items-center justify-between bg-white/3 border border-white/5 px-3 py-1.5">
                    <span className="text-xs text-gray-400 font-mono">{c.email}</span>
                    <button onClick={() => removeCrawlContact(c.email)} className="text-gray-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
                  {crawlContacts.some(c => c.email === a.email) && <span className="text-[10px] text-cyan-400/70 flex-shrink-0">CRL</span>}
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
                <iframe srcDoc={html} className="w-full min-h-[380px] bg-white border border-white/10" title="preview" />
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
