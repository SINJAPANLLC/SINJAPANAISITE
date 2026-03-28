import { useState, useEffect } from "react";
import { customerStore } from "@/hooks/use-admin-data";
import { Mail, Copy, Loader2, Sparkles, Eye, Send, Globe, Plus, Trash2, Search } from "lucide-react";

const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

const TEMPLATES = [
  {
    label: "初回アプローチ",
    subject: "AIで業務を自動化｜最短1週間で現場導入【SIN JAPAN AI】",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\n突然のご連絡、失礼いたします。\n合同会社SIN JAPANと申します。\n\n「AIは気になるけど、何から始めればいいかわからない」\n「費用が高そう、専門知識がなければ使えない」\nそのようなお悩みをお持ちではないでしょうか？\n\n弊社は中小企業専門のAI導入支援会社です。\n3つのことを徹底してサービスを提供しています。\n\n☑️ 安い　── 業界最安水準。まずは小さく始められます\n☑️ 早い　── 最短1週間で現場稼働。スモールスタートで効果を確認\n☑️ 簡単　── 社内にIT担当不要。使い方は丁寧に指導します\n\n実際にこんな変化が起きています：\n\n・見積書・請求書作成が80%時間短縮\n・問い合わせ対応を24時間自動化、営業機会を逃さない\n・スケジュール管理・在庫最適化でミスがゼロに\n\n初回のご相談・デモは完全無料です。\n「話だけ聞いてみたい」でも大歓迎です。\n\nまずは下記URLより詳細をご覧いただき、\nお気軽にお問い合わせください（所要30秒）：\nhttps://sinjapanai.site/\n\n来週15分ほどオンラインでお話しできれば幸いです。\n貴社のご状況に合わせた活用方法をご提案いたします。\n\nどうぞよろしくお願いいたします。`,
  },
  {
    label: "フォローアップ",
    subject: "【SIN JAPAN AI】先日のAI導入ご提案について",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nお世話になっております。\n合同会社SIN JAPANでございます。\n\n先日ご案内させていただいたAI導入支援について、\nその後いかがでしょうか？\n\n「まだ検討中」「もう少し詳しく聞きたい」という場合でも、\nぜひお気軽にご連絡ください。\n\n費用・期間・具体的な活用イメージなど、\n疑問点に何でもお答えします。\n\n▶ 詳細・お問い合わせはこちら：\nhttps://sinjapanai.site/\n\nご返信お待ちしております。`,
  },
  {
    label: "お礼メール",
    subject: "【SIN JAPAN AI】お問い合わせありがとうございます",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n合同会社SIN JAPANでございます。\n\n内容を確認の上、担当者より1営業日以内にご連絡いたします。\n\nまた、サービス概要は下記よりご確認いただけます：\nhttps://sinjapanai.site/\n\n引き続きよろしくお願いいたします。`,
  },
  {
    label: "見積書送付",
    subject: "【SIN JAPAN AI】お見積書のご送付",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもお世話になっております。\n合同会社SIN JAPANでございます。\n\n先日ご相談いただいた件につきまして、\nお見積書を作成いたしましたのでご送付申し上げます。\n\nご不明な点・変更のご要望がございましたら、\nどうぞお気軽にお申し付けください。\nスコープ調整も柔軟に対応いたします。\n\n▶ サービス詳細：https://sinjapanai.site/\n\n何卒よろしくお願いいたします。`,
  },
  {
    label: "請求書送付",
    subject: "【SIN JAPAN AI】ご請求書のご送付",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもお世話になっております。\n合同会社SIN JAPANでございます。\n\n今月分のご請求書を送付させていただきます。\nご確認の上、お振込みいただきますようお願いいたします。\n\nご不明な点がございましたら、何なりとお申し付けください。\n引き続きよろしくお願いいたします。`,
  },
  {
    label: "代理店向け",
    subject: "【SIN JAPAN AI】パートナープログラムのご案内",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nいつもご支援いただきありがとうございます。\n合同会社SIN JAPANでございます。\n\n新しいパートナー向けサービスと、\n最新の代理店資料をお届けいたします。\n\nパートナー様限定の優遇条件（マージン・共同マーケティング支援）も\nご用意しておりますので、ぜひご確認ください。\n\n▶ パートナー詳細：https://sinjapanai.site/\n\n引き続きよろしくお願いいたします。`,
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
          <td></td>
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
            <a href="https://sinjapanai.site/" style="display:block;padding:14px 36px;font-size:12px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:.08em;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">まずは無料相談する &nbsp;&rsaquo;&nbsp; sinjapanai.site</a>
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
            <p style="margin:0;font-size:11px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;">合同会社SIN JAPAN</p>
            <p style="margin:6px 0 0;font-size:10px;color:#999;line-height:1.9;font-family:Helvetica,Arial,sans-serif;">〒243-0303 神奈川県愛甲郡愛川町中津7287<br>Tel 050-5526-9906　Fax 046-212-2326<br>info@sinjapanai.site　sinjapanai.site</p>
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

type RecipientTab = "contact" | "dl" | "crawl";

const TAB_LABELS: Record<RecipientTab, string> = {
  contact: "お問い合わせ",
  dl: "資料DLリード",
  crawl: "クロールリード",
};

type CrawlMode = "url" | "google";

export function EmailSection() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [dlLeads, setDlLeads] = useState<ContactEntry[]>([]);
  const [crawlContacts, setCrawlContacts] = useState<ContactEntry[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [templateIdx, setTemplateIdx] = useState(0);
  const [recipientTab, setRecipientTab] = useState<RecipientTab>("contact");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ContactEntry | null>(null);
  const [mode, setMode] = useState<"template" | "preview">("template");
  const [customBody, setCustomBody] = useState<Record<string, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  // Crawl panel state
  const [showCrawl, setShowCrawl] = useState(false);
  const [crawlMode, setCrawlMode] = useState<CrawlMode>("url");

  // URL crawl
  const [crawlUrl, setCrawlUrl] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<string[]>([]);
  const [crawlError, setCrawlError] = useState("");
  const [crawlSourceLabel, setCrawlSourceLabel] = useState("");

  // Google crawl
  const [googleQuery, setGoogleQuery] = useState("");
  const [googleCrawling, setGoogleCrawling] = useState(false);
  const [googleResult, setGoogleResult] = useState<string[]>([]);
  const [googleError, setGoogleError] = useState("");
  const [googleSitesScanned, setGoogleSitesScanned] = useState(0);
  const [googleMessage, setGoogleMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/contacts", { headers: { "x-admin-token": TOKEN() } })
        .then(r => r.ok ? r.json() : [])
        .then((data: ContactEntry[]) => data.map(c => ({ name: c.name, company: c.company, email: c.email }))),
      fetch("/api/download-leads", { headers: { "x-admin-token": TOKEN() } })
        .then(r => r.ok ? r.json() : [])
        .then((data: ContactEntry[]) => data.map(c => ({ name: c.name, company: c.company, email: c.email }))),
    ])
      .then(([c, d]) => { setContacts(c); setDlLeads(d); })
      .catch(() => {})
      .finally(() => setLoadingContacts(false));
  }, []);

  const customers = customerStore.getAll().map(c => ({ name: c.name, company: c.company, email: c.email }));

  const tabList: Record<RecipientTab, ContactEntry[]> = {
    contact: contacts,
    dl: dlLeads,
    crawl: crawlContacts,
  };

  const currentList = tabList[recipientTab];

  const tpl = TEMPLATES[templateIdx];
  const toggleAll = () => {
    const emails = new Set(currentList.map(a => a.email));
    const allSelected = currentList.every(a => selected.has(a.email));
    const s = new Set(selected);
    if (allSelected) { emails.forEach(e => s.delete(e)); }
    else { emails.forEach(e => s.add(e)); }
    setSelected(s);
  };
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

  const sendSelected = async () => {
    const all = [...contacts, ...dlLeads, ...crawlContacts, ...customers];
    const targets = all.filter(a => selected.has(a.email));
    for (const a of targets) await sendMail(a);
  };

  // URL crawl
  const safeHostname = (url: string) => {
    try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname; } catch { return url; }
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
      setCrawlSourceLabel(safeHostname(crawlUrl));
      setCrawlResult(data.emails || []);
    } catch { setCrawlError("ネットワークエラー"); }
    finally { setCrawling(false); }
  };

  const addCrawledEmail = (email: string, source: string) => {
    if (crawlContacts.some(c => c.email === email)) return;
    setCrawlContacts(prev => [...prev, { name: "担当者", company: source, email }]);
    setRecipientTab("crawl");
  };

  const addAllCrawled = (emails: string[], source: string) => {
    const existing = new Set(crawlContacts.map(c => c.email));
    const newOnes = emails.filter(e => !existing.has(e)).map(email => ({ name: "担当者", company: source, email } as ContactEntry));
    setCrawlContacts(prev => [...prev, ...newOnes]);
    setRecipientTab("crawl");
  };

  // Google crawl
  const doGoogleCrawl = async () => {
    if (!googleQuery.trim()) return;
    setGoogleCrawling(true); setGoogleResult([]); setGoogleError(""); setGoogleSitesScanned(0); setGoogleMessage("");
    try {
      const res = await fetch("/api/crawl-google", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({ query: googleQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setGoogleError(data.error || "エラー"); return; }
      setGoogleResult(data.emails || []);
      setGoogleSitesScanned(data.sitesScanned || 0);
      setGoogleMessage(data.message || "");
    } catch { setGoogleError("ネットワークエラー"); }
    finally { setGoogleCrawling(false); }
  };

  const html = preview ? buildHtml(preview.name, preview.company, tpl.subject, getBody(preview)) : "";

  const tabCount: Record<RecipientTab, number> = {
    contact: contacts.length,
    dl: dlLeads.length,
    crawl: crawlContacts.length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-black">メール営業</h2>
        <div className="flex gap-2">
          <button onClick={() => { setShowCrawl(v => !v); setCrawlMode("url"); }}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 border transition-colors ${showCrawl && crawlMode === "url" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500 hover:text-white"}`}>
            <Globe className="w-3.5 h-3.5" /> メールクロール
          </button>
          <button onClick={() => { setShowCrawl(v => crawlMode === "google" ? !v : true); setCrawlMode("google"); }}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 border transition-colors ${showCrawl && crawlMode === "google" ? "border-white/30 text-white bg-white/10" : "border-white/10 text-gray-500 hover:text-white"}`}>
            <Search className="w-3.5 h-3.5" /> Googleクロール
          </button>
        </div>
      </div>

      {/* Crawl panel */}
      {showCrawl && (
        <div className="border border-white/10 bg-white/3 p-4 flex flex-col gap-3">
          {crawlMode === "url" ? (
            <>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">— ウェブサイトURLからメールアドレスを抽出</p>
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
                    <button onClick={() => addAllCrawled(crawlResult, crawlSourceLabel)}
                      className="text-[10px] text-white hover:text-gray-300 flex items-center gap-1 border border-white/20 px-2 py-0.5">
                      <Plus className="w-3 h-3" />全て追加
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto border border-white/10 divide-y divide-white/5">
                    {crawlResult.map(email => {
                      const added = crawlContacts.some(c => c.email === email);
                      return (
                        <div key={email} className="flex items-center justify-between px-3 py-1.5">
                          <span className="text-xs text-gray-300 font-mono truncate flex-1">{email}</span>
                          <button onClick={() => addCrawledEmail(email, crawlSourceLabel)} disabled={added}
                            className={`text-[10px] px-2 py-0.5 ml-2 flex-shrink-0 border transition-colors ${added ? "border-white/10 text-gray-600 cursor-default" : "border-white/20 text-white hover:bg-white/5"}`}>
                            {added ? "追加済" : "追加"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">— 業種・地域を入力して中小法人のメールを自動収集</p>
              <p className="text-[10px] text-gray-600">例: 「神奈川 運送業」「東京 製造業 中小企業」「大阪 建設会社」</p>
              <div className="flex gap-2">
                <input value={googleQuery} onChange={e => setGoogleQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && doGoogleCrawl()}
                  placeholder="例: 神奈川 運送業 / 東京 製造業 / 大阪 建設会社"
                  className="flex-1 bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-white/30 placeholder-gray-600" />
                <button onClick={doGoogleCrawl} disabled={googleCrawling || !googleQuery.trim()}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 transition-colors">
                  {googleCrawling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  {googleCrawling ? "収集中…" : "収集開始"}
                </button>
              </div>
              {googleCrawling && (
                <p className="text-[10px] text-gray-500 animate-pulse">企業サイトを順次クロールしています（20〜40秒かかります）…</p>
              )}
              {googleError && <p className="text-xs text-red-400">{googleError}</p>}
              {googleMessage && !googleCrawling && (
                <p className="text-[10px] text-yellow-500">{googleMessage}</p>
              )}
              {!googleCrawling && googleSitesScanned > 0 && (
                <p className="text-[10px] text-gray-500">{googleSitesScanned}サイトをスキャン → {googleResult.length}件のメールアドレスを検出</p>
              )}
              {googleResult.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-green-400 font-bold">✓ {googleResult.length}件検出</p>
                    <button onClick={() => addAllCrawled(googleResult, googleQuery.trim())}
                      className="text-[10px] text-white hover:text-gray-300 flex items-center gap-1 border border-white/20 px-2 py-0.5">
                      <Plus className="w-3 h-3" />全て追加
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-white/10 divide-y divide-white/5">
                    {googleResult.map(email => {
                      const added = crawlContacts.some(c => c.email === email);
                      return (
                        <div key={email} className="flex items-center justify-between px-3 py-1.5">
                          <span className="text-xs text-gray-300 font-mono truncate flex-1">{email}</span>
                          <button onClick={() => addCrawledEmail(email, googleQuery.trim())} disabled={added}
                            className={`text-[10px] px-2 py-0.5 ml-2 flex-shrink-0 border transition-colors ${added ? "border-white/10 text-gray-600 cursor-default" : "border-white/20 text-white hover:bg-white/5"}`}>
                            {added ? "追加済" : "追加"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {!googleCrawling && googleResult.length === 0 && googleSitesScanned > 0 && !googleError && (
                <p className="text-[10px] text-gray-600">メールアドレスが見つかりませんでした。別のキーワードで試してください。</p>
              )}
              {!googleCrawling && googleSitesScanned === 0 && !googleError && !googleMessage && (
                <p className="text-[10px] text-gray-600">※ 業種・地域・会社名などのキーワードで検索。ヒットした企業サイトを自動クロールします</p>
              )}
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        {/* Left */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Templates */}
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

          {/* Recipient tabs */}
          <div>
            {/* Tab buttons */}
            <div className="flex border-b border-white/10 mb-0">
              {(["contact", "dl", "crawl"] as RecipientTab[]).map(tab => (
                <button key={tab} onClick={() => setRecipientTab(tab)}
                  className={`flex-1 text-[10px] font-bold py-2 px-1 tracking-wide border-b-2 transition-colors ${recipientTab === tab ? "border-white text-white" : "border-transparent text-gray-600 hover:text-gray-400"}`}>
                  {TAB_LABELS[tab]}
                  <span className="ml-1 text-gray-600">({loadingContacts && tab !== "crawl" ? "…" : tabCount[tab]})</span>
                </button>
              ))}
            </div>

            {/* Tab action row */}
            <div className="flex items-center justify-between py-1.5 px-0.5">
              <p className="text-[10px] text-gray-600">
                {selected.size > 0 && <span className="text-white font-bold">{selected.size}件選択中</span>}
              </p>
              <div className="flex gap-2 items-center">
                {selected.size > 0 && (
                  <button onClick={sendSelected} disabled={!!sending}
                    className="flex items-center gap-1 text-[10px] font-bold bg-white text-gray-900 px-2 py-1 hover:bg-gray-100 disabled:opacity-60 transition-colors">
                    <Mail className="w-3 h-3" /> 一括送信
                  </button>
                )}
                <button onClick={toggleAll} className="text-[10px] text-gray-400 hover:text-white">
                  {currentList.length > 0 && currentList.every(a => selected.has(a.email)) ? "全解除" : "全選択"}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="border border-white/10 max-h-60 overflow-y-auto">
              {loadingContacts && recipientTab !== "crawl" && (
                <div className="flex justify-center p-6"><Loader2 className="w-4 h-4 animate-spin text-gray-600" /></div>
              )}
              {!loadingContacts && currentList.length === 0 && (
                <p className="text-xs text-gray-600 p-4 text-center">
                  {recipientTab === "crawl" ? "クロールしてリードを追加してください" : "連絡先がありません"}
                </p>
              )}
              {currentList.map(a => (
                <div key={a.email} className="flex items-center gap-3 px-3 py-2 border-b border-white/5 hover:bg-white/5">
                  <input type="checkbox" checked={selected.has(a.email)} onChange={e => {
                    const s = new Set(selected);
                    e.target.checked ? s.add(a.email) : s.delete(a.email);
                    setSelected(s);
                  }} className="accent-white flex-shrink-0" />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setPreview(a); setMode("template"); }}>
                    <p className="text-xs font-bold truncate">{a.name} <span className="text-gray-500 font-normal">{a.company}</span></p>
                    <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {sent.has(a.email) && <span className="text-[10px] text-green-400">送済</span>}
                    {recipientTab === "crawl" && (
                      <button onClick={() => setCrawlContacts(prev => prev.filter(x => x.email !== a.email))}
                        className="text-gray-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    )}
                  </div>
                </div>
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
