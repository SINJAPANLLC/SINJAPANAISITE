import { useState } from "react";
import { estimateStore, type Estimate, type LineItem } from "@/hooks/use-admin-data";
import { Plus, Trash2, X, Eye, Send, Loader2 } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ja-JP");
const calcTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

const STATUS_LABELS: Record<Estimate["status"], string> = {
  draft: "下書き", sent: "送付済", accepted: "承認済", rejected: "却下",
};

function buildEstimateHtml(est: Estimate): string {
  const sub = calcTotal(est.items);
  const tax = Math.floor(sub * 0.1);
  const total = sub + tax;
  const rows = est.items.map(l =>
    `<tr><td style="border:1px solid #e5e7eb;padding:8px 12px;">${l.description}</td>
    <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">${l.qty}</td>
    <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">¥${fmt(l.unitPrice)}</td>
    <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;font-weight:bold;">¥${fmt(l.qty * l.unitPrice)}</td></tr>`
  ).join("");
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
<div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:48px;">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
<div><p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 8px;">合同会社SIN JAPAN</p>
<h1 style="font-size:28px;font-weight:900;color:#111827;margin:0;">見&nbsp;積&nbsp;書</h1></div>
<div style="text-align:right;font-size:12px;color:#6b7280;line-height:2;">
<p style="margin:0;">見積書番号: <strong>${est.estimateNo}</strong></p>
<p style="margin:0;">見積日: ${est.date}</p>
<p style="margin:0;">有効期限: ${est.validUntil}</p>
</div></div>
<div style="background:#f3f4f6;padding:16px 20px;margin-bottom:32px;">
<p style="margin:0;font-size:14px;color:#374151;">${est.company}&nbsp; ${est.client}&nbsp;様</p>
</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
<thead><tr style="background:#111827;color:#fff;">
<th style="padding:10px 12px;text-align:left;border:1px solid #374151;">内容</th>
<th style="padding:10px 12px;text-align:right;border:1px solid #374151;width:60px;">数量</th>
<th style="padding:10px 12px;text-align:right;border:1px solid #374151;width:100px;">単価</th>
<th style="padding:10px 12px;text-align:right;border:1px solid #374151;width:120px;">小計</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
<table style="font-size:13px;"><tbody>
<tr><td style="padding:4px 24px;color:#6b7280;">小計</td><td style="padding:4px 0;text-align:right;">¥${fmt(sub)}</td></tr>
<tr><td style="padding:4px 24px;color:#6b7280;">消費税（10%）</td><td style="padding:4px 0;text-align:right;">¥${fmt(tax)}</td></tr>
<tr style="background:#111827;color:#fff;"><td style="padding:8px 24px;font-weight:900;">合計</td><td style="padding:8px 0;text-align:right;font-weight:900;font-size:18px;">¥${fmt(total)}</td></tr>
</tbody></table>
</div>
${est.notes ? `<div style="border-left:3px solid #e5e7eb;padding-left:16px;font-size:13px;color:#6b7280;margin-bottom:32px;"><p style="font-weight:bold;margin:0 0 6px;">備考</p><p style="margin:0;">${est.notes}</p></div>` : ""}
<div style="background:#111827;color:#fff;padding:20px;margin-top:32px;">
<p style="font-size:12px;font-weight:900;margin:0 0 8px;">合同会社SIN JAPAN</p>
<p style="font-size:11px;color:#9ca3af;margin:0;line-height:1.8;">〒241-0105 神奈川県愛甲郡愛川町中津7287<br>Tel: 050-5526-9906 / info@sinjapanai.site</p>
</div></div></body></html>`;
}

function PreviewModal({ estimate, onClose }: { estimate: Estimate; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const html = buildEstimateHtml(estimate);

  const send = async () => {
    setSending(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({
          to: estimate.email,
          subject: `【合同会社SIN JAPAN】見積書 ${estimate.estimateNo} をお送りします`,
          html,
        }),
      });
      estimateStore.update(estimate.id, { status: "sent" });
      setSent(true);
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-black">見積書プレビュー — {estimate.estimateNo}</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
        </div>
        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Send className="w-8 h-8 text-green-400" />
            <p className="text-green-400 font-bold">送信完了</p>
            <button onClick={onClose} className="text-xs text-gray-400 underline">閉じる</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4">
              <iframe srcDoc={html} className="w-full min-h-[500px] bg-white border-0" title="estimate preview" />
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-gray-500">送信先: <span className="text-white">{estimate.email}</span></p>
              <div className="flex gap-3">
                <button onClick={onClose} className="text-xs text-gray-500 hover:text-white px-4 py-2">閉じる</button>
                <button onClick={send} disabled={sending}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-5 py-2 hover:bg-gray-100 disabled:opacity-60">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} メールで送信
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function EstimateSection() {
  const [items, setItems] = useState<Estimate[]>(() => estimateStore.getAll());
  const [mode, setMode] = useState<"list" | "create">("list");
  const [preview, setPreview] = useState<Estimate | null>(null);
  const [form, setForm] = useState({ estimateNo: "", client: "", company: "", email: "", date: "", validUntil: "", notes: "" });
  const [lines, setLines] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0 }]);

  const addLine = () => setLines([...lines, { description: "", qty: 1, unitPrice: 0 }]);
  const updateLine = (i: number, key: keyof LineItem, val: string | number) =>
    setLines(lines.map((l, idx) => idx === i ? { ...l, [key]: key === "description" ? val : Number(val) } : l));
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = estimateStore.add({ ...form, items: lines, status: "draft" });
    setItems([item, ...items]);
    setMode("list");
    setLines([{ description: "", qty: 1, unitPrice: 0 }]);
    setForm({ estimateNo: "", client: "", company: "", email: "", date: "", validUntil: "", notes: "" });
  };

  if (mode === "create") return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">新規見積もり作成</h2>
        <button type="button" onClick={() => setMode("list")} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[["見積書番号", "estimateNo", "EST-001"], ["顧客名", "client", "山田 太郎"], ["会社名", "company", "株式会社〇〇"],
          ["メール", "email", "email@example.com"], ["見積日", "date", ""], ["有効期限", "validUntil", ""]].map(([label, key, ph]) => (
          <div key={key}>
            <label className="text-[10px] text-gray-500 mb-1 block">{label}</label>
            <input type={key.includes("date") || key.includes("Until") ? "date" : "text"} placeholder={ph} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none" />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">明細</p>
          <button type="button" onClick={addLine} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3" />行追加</button>
        </div>
        <div className="border border-white/10">
          <div className="grid grid-cols-12 px-3 py-2 border-b border-white/10 text-[10px] text-gray-500">
            <span className="col-span-6">内容</span><span className="col-span-2 text-right">数量</span>
            <span className="col-span-3 text-right">単価</span><span className="col-span-1" />
          </div>
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-white/5">
              <input className="col-span-6 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 outline-none" placeholder="サービス内容" value={l.description}
                onChange={e => updateLine(i, "description", e.target.value)} />
              <input type="number" className="col-span-2 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 text-right outline-none" value={l.qty}
                onChange={e => updateLine(i, "qty", e.target.value)} />
              <input type="number" className="col-span-3 h-8 bg-white/10 border border-white/10 text-white text-sm px-2 text-right outline-none" value={l.unitPrice}
                onChange={e => updateLine(i, "unitPrice", e.target.value)} />
              <button type="button" onClick={() => removeLine(i)} className="col-span-1 flex items-center justify-center text-gray-600 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <div className="flex justify-end px-3 py-3 text-sm font-black">合計：¥{fmt(calcTotal(lines))}</div>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-gray-500 mb-1 block">備考</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full h-20 bg-white/10 border border-white/10 text-white text-sm px-3 py-2 outline-none resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-6 py-2">保存</button>
        <button type="button" onClick={() => setMode("list")} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      {preview && <PreviewModal estimate={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">見積もり管理</h2>
        <button onClick={() => setMode("create")} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新規作成
        </button>
      </div>
      <div className="border border-white/10">
        <div className="grid grid-cols-6 px-4 py-2 border-b border-white/10 text-[10px] text-gray-500 tracking-widest uppercase">
          <span>番号</span><span>顧客</span><span>日付</span><span className="text-right">金額</span><span className="text-right">状態</span><span className="text-right">操作</span>
        </div>
        {items.length === 0 && <div className="py-12 text-center text-xs text-gray-600">見積もりはありません</div>}
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-6 px-4 py-3 border-b border-white/5 text-sm hover:bg-white/5 group items-center">
            <span className="font-mono text-xs text-gray-400">{item.estimateNo}</span>
            <span className="truncate">{item.client}</span>
            <span className="text-gray-400 text-xs">{item.date}</span>
            <span className="text-right font-bold">¥{fmt(calcTotal(item.items))}</span>
            <span className="text-right text-xs text-gray-400">{STATUS_LABELS[item.status]}</span>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPreview(item)} title="プレビュー & 送信"
                className="text-gray-600 hover:text-white transition-colors flex items-center gap-1 text-xs">
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
