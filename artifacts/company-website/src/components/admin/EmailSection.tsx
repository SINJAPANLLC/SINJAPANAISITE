import { useState, useEffect } from "react";
import { customerStore } from "@/hooks/use-admin-data";
import { Mail, Copy, Loader2 } from "lucide-react";

const TEMPLATES = [
  {
    label: "初回アプローチ",
    subject: "【合同会社SIN JAPAN】AI導入支援のご提案",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nはじめてご連絡させていただきます。\n合同会社SIN JAPANと申します。\n\n弊社は、AI導入支援・AI開発を専門とした会社です。\n貴社のビジネス課題をAIで解決するご提案が可能です。\n\n一度、オンラインにてご説明の機会をいただけますでしょうか。\n\nどうぞよろしくお願いいたします。\n\n───────────────\n合同会社SIN JAPAN\ninfo@sinjapanai.site\n050-5526-9906\n───────────────`,
  },
  {
    label: "フォローアップ",
    subject: "【合同会社SIN JAPAN】先日のご提案の件",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nお世話になっております。\n合同会社SIN JAPANです。\n\n先日ご提案させていただいた件について、\nご検討いただけましたでしょうか？\n\nご不明な点がございましたら、\nお気軽にご連絡ください。\n\nよろしくお願いいたします。\n\n合同会社SIN JAPAN\ninfo@sinjapanai.site`,
  },
  {
    label: "お礼メール",
    subject: "【合同会社SIN JAPAN】お問い合わせいただきありがとうございます",
    body: (name: string, company: string) =>
      `${company}\n${name} 様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n合同会社SIN JAPANです。\n\n担当者より改めてご連絡させていただきます。\n今しばらくお待ちいただけますようお願い申し上げます。\n\nよろしくお願いいたします。\n\n合同会社SIN JAPAN\ninfo@sinjapanai.site`,
  },
];

type ContactEntry = { name: string; company: string; email: string };

export function EmailSection() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    const password = import.meta.env.VITE_ADMIN_PASSWORD || "";
    fetch("/api/contacts", { headers: { "x-admin-token": password } })
      .then(r => r.ok ? r.json() : [])
      .then((data: ContactEntry[]) => setContacts(data.map(c => ({ name: c.name, company: c.company, email: c.email }))))
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, []);

  const customers = customerStore.getAll();
  const contactEmails = new Set(contacts.map(c => c.email));
  const all: ContactEntry[] = [
    ...contacts,
    ...customers.filter(c => !contactEmails.has(c.email)).map(c => ({ name: c.name, company: c.company, email: c.email })),
  ];

  const [templateIdx, setTemplateIdx] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ContactEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const tpl = TEMPLATES[templateIdx];
  const toggleAll = () => setSelected(selected.size === all.length ? new Set() : new Set(all.map(a => a.email)));

  const previewBody = preview ? tpl.body(preview.name, preview.company) : "";
  const mailtoLink = preview
    ? `mailto:${preview.email}?subject=${encodeURIComponent(tpl.subject)}&body=${encodeURIComponent(previewBody)}`
    : "#";

  const copyBody = () => {
    if (!preview) return;
    navigator.clipboard.writeText(`件名: ${tpl.subject}\n\n${previewBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-black">メール営業</h2>
      <div className="grid grid-cols-5 gap-6">
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
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                送信先リスト（{loadingContacts ? "…" : all.length}件）
              </p>
              <button onClick={toggleAll} className="text-[10px] text-gray-400 hover:text-white">
                {selected.size === all.length ? "全解除" : "全選択"}
              </button>
            </div>
            <div className="border border-white/10 max-h-60 overflow-y-auto">
              {loadingContacts && (
                <div className="flex items-center justify-center p-6 gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">読み込み中...</span>
                </div>
              )}
              {!loadingContacts && all.length === 0 && (
                <p className="text-xs text-gray-600 p-4 text-center">連絡先がありません</p>
              )}
              {!loadingContacts && all.map(a => (
                <label key={a.email}
                  className="flex items-center gap-3 px-3 py-2 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => setPreview(a)}>
                  <input type="checkbox" checked={selected.has(a.email)} onChange={e => {
                    const s = new Set(selected);
                    e.target.checked ? s.add(a.email) : s.delete(a.email);
                    setSelected(s);
                  }} className="accent-white" />
                  <div>
                    <p className="text-xs font-bold">{a.name}</p>
                    <p className="text-[10px] text-gray-500">{a.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-3">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">
            プレビュー {preview ? `— ${preview.name}様` : "（左から送信先を選択）"}
          </p>
          {preview ? (
            <div className="bg-white/5 border border-white/10 p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-400">件名：<span className="text-white">{tpl.subject}</span></p>
              <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{previewBody}</pre>
              <div className="flex gap-3 pt-2 border-t border-white/10">
                <a href={mailtoLink}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> メーラーで開く
                </a>
                <button onClick={copyBody}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 border border-white/10">
                  <Copy className="w-3.5 h-3.5" /> {copied ? "コピー完了" : "コピー"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-white/10 flex items-center justify-center h-48">
              <p className="text-xs text-gray-600">送信先を選ぶとプレビューが表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
