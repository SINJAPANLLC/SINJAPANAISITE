import { useState } from "react";
import { estimateStore, type Estimate, type LineItem } from "@/hooks/use-admin-data";
import { Plus, Trash2, X, Eye, Send, Loader2 } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ja-JP");
const calcTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

const STATUS_LABELS: Record<Estimate["status"], string> = {
  draft: "下書き", sent: "送付済", accepted: "承認済", rejected: "却下",
};
const STATUS_COLORS: Record<Estimate["status"], string> = {
  draft: "text-gray-400", sent: "text-blue-400", accepted: "text-green-400", rejected: "text-red-400",
};

function buildEstimateHtml(est: Estimate): string {
  const sub = calcTotal(est.items);
  const tax = Math.floor(sub * 0.1);
  const total = sub + tax;
  const rows = est.items.map((l, i) =>
    `<tr style="background:${i % 2 === 0 ? "#fff" : "#fafafa"}">
      <td style="padding:14px 20px;font-size:14px;color:#1f2937;border-bottom:1px solid #f3f4f6;">${l.description}</td>
      <td style="padding:14px 16px;font-size:14px;color:#6b7280;text-align:center;border-bottom:1px solid #f3f4f6;">${l.qty}</td>
      <td style="padding:14px 16px;font-size:14px;color:#6b7280;text-align:right;border-bottom:1px solid #f3f4f6;">¥${fmt(l.unitPrice)}</td>
      <td style="padding:14px 20px;font-size:14px;font-weight:700;color:#111827;text-align:right;border-bottom:1px solid #f3f4f6;">¥${fmt(l.qty * l.unitPrice)}</td>
    </tr>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>見積書 ${est.estimateNo}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',Arial,sans-serif;">
<div style="max-width:700px;margin:0 auto;padding:24px 16px;">

  <!-- Header bar -->
  <div style="background:#111827;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div>
      <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;">合同会社 SIN JAPAN</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#fff;letter-spacing:.05em;">見&nbsp;積&nbsp;書</p>
    </div>
    <div style="text-align:right;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">見積書番号</p>
      <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:#fff;">${est.estimateNo}</p>
    </div>
  </div>

  <!-- White card -->
  <div style="background:#fff;padding:28px;">

    <!-- Meta info -->
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:28px;padding-bottom:24px;border-bottom:2px solid #f3f4f6;">
      <div>
        <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">お見積り先</p>
        <p style="margin:0;font-size:15px;font-weight:700;color:#1f2937;">${est.company}</p>
        <p style="margin:2px 0 0;font-size:14px;color:#374151;">${est.client}&nbsp;様</p>
      </div>
      <div style="text-align:right;">
        <div style="display:inline-block;">
          <table style="font-size:13px;border-collapse:collapse;">
            <tr><td style="padding:3px 12px 3px 0;color:#9ca3af;">見積日</td><td style="padding:3px 0;color:#1f2937;font-weight:600;">${est.date}</td></tr>
            <tr><td style="padding:3px 12px 3px 0;color:#9ca3af;">有効期限</td><td style="padding:3px 0;color:#1f2937;font-weight:600;">${est.validUntil}</td></tr>
          </table>
        </div>
      </div>
    </div>

    <!-- Amount highlight -->
    <div style="background:#111827;padding:20px 24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <p style="margin:0;font-size:13px;color:#9ca3af;font-weight:600;">お見積り金額（税込）</p>
      <p style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:.02em;">¥${fmt(total)}</p>
    </div>

    <!-- Line items -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:11px 20px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e5e7eb;">内容</th>
          <th style="padding:11px 16px;text-align:center;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e5e7eb;width:60px;">数量</th>
          <th style="padding:11px 16px;text-align:right;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e5e7eb;width:110px;">単価</th>
          <th style="padding:11px 20px;text-align:right;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #e5e7eb;width:120px;">小計</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Subtotals -->
    <div style="border-top:2px solid #e5e7eb;padding:20px 20px 0;display:flex;justify-content:flex-end;">
      <table style="min-width:240px;font-size:13px;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 20px 6px 0;color:#6b7280;">小計</td>
          <td style="padding:6px 0;text-align:right;color:#374151;font-weight:600;">¥${fmt(sub)}</td>
        </tr>
        <tr>
          <td style="padding:6px 20px 6px 0;color:#6b7280;">消費税（10%）</td>
          <td style="padding:6px 0;text-align:right;color:#374151;font-weight:600;">¥${fmt(tax)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0;"><div style="height:1px;background:#e5e7eb;margin:8px 0;"></div></td>
        </tr>
        <tr>
          <td style="padding:8px 20px 8px 0;font-size:15px;font-weight:700;color:#111827;">合計（税込）</td>
          <td style="padding:8px 0;text-align:right;font-size:20px;font-weight:900;color:#111827;">¥${fmt(total)}</td>
        </tr>
      </table>
    </div>

    ${est.notes ? `
    <!-- Notes -->
    <div style="margin-top:24px;padding:16px 20px;background:#f9fafb;border-left:3px solid #111827;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;">備考</p>
      <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;">${est.notes}</p>
    </div>` : ""}
  </div>

  <!-- Footer -->
  <div style="background:#1f2937;padding:20px 28px;">
    <p style="margin:0 0 2px;font-size:12px;font-weight:900;color:#fff;">合同会社SIN JAPAN</p>
    <p style="margin:0;font-size:11px;color:#6b7280;line-height:1.9;">
      〒241-0105 神奈川県愛甲郡愛川町中津7287<br>
      Tel: 050-5526-9906&nbsp;&nbsp;|&nbsp;&nbsp;info@sinjapanai.site
    </p>
  </div>

</div>
</body>
</html>`;
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h3 className="font-black text-sm">見積書プレビュー — {estimate.estimateNo}</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
        </div>
        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Send className="w-8 h-8 text-green-400" />
            <p className="text-green-400 font-bold">送信完了しました</p>
            <button onClick={onClose} className="text-xs text-gray-400 underline">閉じる</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              <iframe srcDoc={html} className="w-full min-h-[520px] bg-white border-0 block" style={{ height: "520px" }} title="estimate preview" />
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
              <p className="text-xs text-gray-500">送信先: <span className="text-white font-mono">{estimate.email}</span></p>
              <div className="flex gap-3">
                <button onClick={onClose} className="text-xs text-gray-500 hover:text-white px-4 py-2">閉じる</button>
                <button onClick={send} disabled={sending}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-5 py-2.5 hover:bg-gray-100 disabled:opacity-60 transition-colors">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  メールで送信
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[["見積書番号", "estimateNo", "EST-001", "text"], ["顧客名", "client", "山田 太郎", "text"], ["会社名", "company", "株式会社〇〇", "text"],
          ["メール", "email", "email@example.com", "email"], ["見積日", "date", "", "date"], ["有効期限", "validUntil", "", "date"]].map(([label, key, ph, type]) => (
          <div key={key}>
            <label className="text-[10px] text-gray-500 mb-1 block tracking-widest">{label}</label>
            <input type={type} placeholder={ph} value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full h-9 bg-white/10 border border-white/10 text-white text-sm px-3 outline-none focus:border-white/30" />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-500 tracking-widest uppercase">明細</p>
          <button type="button" onClick={addLine} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"><Plus className="w-3 h-3" />行追加</button>
        </div>
        <div className="border border-white/10 overflow-x-auto">
          <div className="grid grid-cols-12 px-3 py-2 border-b border-white/10 text-[10px] text-gray-500 min-w-[480px]">
            <span className="col-span-6">内容</span><span className="col-span-2 text-right">数量</span>
            <span className="col-span-3 text-right">単価</span><span className="col-span-1" />
          </div>
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-white/5 min-w-[480px]">
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
          <div className="flex justify-end px-3 py-3 text-sm font-black min-w-[480px]">合計：¥{fmt(calcTotal(lines))}</div>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-gray-500 mb-1 block tracking-widest">備考</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full h-20 bg-white/10 border border-white/10 text-white text-sm px-3 py-2 outline-none resize-none" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-6 py-2.5 hover:bg-gray-100 transition-colors">保存する</button>
        <button type="button" onClick={() => setMode("list")} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      {preview && <PreviewModal estimate={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-black">見積もり管理</h2>
        <button onClick={() => setMode("create")} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新規作成
        </button>
      </div>

      {items.length === 0 ? (
        <div className="border border-white/10 py-16 text-center text-xs text-gray-600">見積もりはありません</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-0.5">{item.estimateNo}</span>
                    <span className={`text-[10px] font-bold tracking-widest ${STATUS_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                  </div>
                  <p className="font-black text-base mt-1">{item.client} <span className="text-gray-500 font-normal text-sm">/ {item.company}</span></p>
                  <p className="text-xs text-gray-500">見積日: {item.date} → 有効期限: {item.validUntil}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-black">¥{fmt(calcTotal(item.items))}<span className="text-xs text-gray-500 font-normal ml-1">（税抜）</span></p>
                  <button onClick={() => setPreview(item)}
                    className="flex items-center gap-1.5 text-[10px] font-bold border border-white/20 px-3 py-1.5 hover:bg-white/10 transition-colors">
                    <Eye className="w-3 h-3" /> プレビュー & 送信
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
