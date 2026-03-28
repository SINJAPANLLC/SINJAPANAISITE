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
  const rows = est.items.map(l =>
    `<tr>
      <td style="padding:12px 20px;font-size:13px;color:#222;border-bottom:1px solid #ebebeb;font-family:Helvetica,Arial,sans-serif;">${l.description}</td>
      <td style="padding:12px 16px;font-size:13px;color:#888;text-align:center;border-bottom:1px solid #ebebeb;font-family:Helvetica,Arial,sans-serif;">${l.qty}</td>
      <td style="padding:12px 16px;font-size:13px;color:#888;text-align:right;border-bottom:1px solid #ebebeb;font-family:Helvetica,Arial,sans-serif;">¥${fmt(l.unitPrice)}</td>
      <td style="padding:12px 20px;font-size:13px;font-weight:700;color:#000;text-align:right;border-bottom:1px solid #ebebeb;font-family:Helvetica,Arial,sans-serif;">¥${fmt(l.qty * l.unitPrice)}</td>
    </tr>`
  ).join("");
  return `<!DOCTYPE html>
<html lang="ja" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>見積書 ${est.estimateNo}</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f0;">
<tr><td align="center" style="padding:40px 16px;">
<table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;background:#fff;">

  <!-- 3px top rule -->
  <tr><td style="background:#000;height:3px;font-size:0;">&nbsp;</td></tr>

  <!-- Header -->
  <tr>
    <td style="padding:24px 40px 20px;border-bottom:1px solid #e8e8e8;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.3em;color:#999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">合同会社 SIN JAPAN</p>
            <p style="margin:4px 0 0;font-size:9px;letter-spacing:.15em;color:#ccc;font-family:Helvetica,Arial,sans-serif;">AI INTEGRATION &amp; DEVELOPMENT</p>
          </td>
          <td align="right" style="vertical-align:middle;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.3em;color:#bbb;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">ESTIMATE</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;letter-spacing:-.01em;">見積書</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Doc no + dates -->
  <tr>
    <td style="padding:20px 40px;background:#fafafa;border-bottom:1px solid #ebebeb;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.2em;color:#aaa;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">お見積り先</p>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
              <tr>
                <td style="width:2px;background:#000;padding:0;">&nbsp;</td>
                <td style="padding:0 0 0 14px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#555;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${est.company}</p>
                  <p style="margin:3px 0 0;font-size:15px;font-weight:900;color:#000;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${est.client}&nbsp;<span style="font-size:12px;font-weight:400;color:#666;">様</span></p>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;border-collapse:collapse;">
              <tr><td style="padding:3px 16px 3px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">見積書番号</td><td style="padding:3px 0;color:#000;font-weight:700;font-family:Helvetica,Arial,sans-serif;">${est.estimateNo}</td></tr>
              <tr><td style="padding:3px 16px 3px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">見積日</td><td style="padding:3px 0;color:#333;font-family:Helvetica,Arial,sans-serif;">${est.date}</td></tr>
              <tr><td style="padding:3px 16px 3px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">有効期限</td><td style="padding:3px 0;color:#333;font-family:Helvetica,Arial,sans-serif;">${est.validUntil}</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Amount block -->
  <tr>
    <td style="padding:0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000;margin:24px 0 0;">
        <tr>
          <td style="padding:16px 24px;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.2em;color:#888;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">お見積り金額（税込）</p>
          </td>
          <td align="right" style="padding:16px 24px;">
            <p style="margin:0;font-size:26px;font-weight:900;color:#fff;font-family:Helvetica,Arial,sans-serif;letter-spacing:-.01em;">¥${fmt(total)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Line items -->
  <tr>
    <td style="padding:0 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-top:2px solid #000;">
        <tr style="background:#f5f5f5;">
          <th style="padding:10px 20px;text-align:left;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;font-family:Helvetica,Arial,sans-serif;border-bottom:1px solid #ddd;">内容</th>
          <th style="padding:10px 12px;text-align:center;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;font-family:Helvetica,Arial,sans-serif;border-bottom:1px solid #ddd;width:60px;">数量</th>
          <th style="padding:10px 12px;text-align:right;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;font-family:Helvetica,Arial,sans-serif;border-bottom:1px solid #ddd;width:110px;">単価</th>
          <th style="padding:10px 20px;text-align:right;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.1em;font-family:Helvetica,Arial,sans-serif;border-bottom:1px solid #ddd;width:110px;">小計</th>
        </tr>
        ${rows}
      </table>
    </td>
  </tr>

  <!-- Subtotals -->
  <tr>
    <td style="padding:0 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:0;border-top:2px solid #000;">
        <tr>
          <td style="padding:8px 0;">&nbsp;</td>
          <td align="right" style="padding:8px 20px 4px;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;border-collapse:collapse;">
              <tr><td style="padding:4px 24px 4px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">小計</td><td style="padding:4px 0;text-align:right;color:#333;font-family:Helvetica,Arial,sans-serif;">¥${fmt(sub)}</td></tr>
              <tr><td style="padding:4px 24px 4px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">消費税（10%）</td><td style="padding:4px 0;text-align:right;color:#333;font-family:Helvetica,Arial,sans-serif;">¥${fmt(tax)}</td></tr>
              <tr><td colspan="2" style="padding:0;height:1px;background:#ddd;font-size:0;">&nbsp;</td></tr>
              <tr><td style="padding:8px 24px 4px 0;font-size:14px;font-weight:700;color:#000;font-family:Helvetica,Arial,sans-serif;">合計（税込）</td><td style="padding:8px 0 4px;text-align:right;font-size:18px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;">¥${fmt(total)}</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${est.notes ? `
  <!-- Notes -->
  <tr>
    <td style="padding:16px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-left:2px solid #000;padding-left:14px;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:.2em;color:#aaa;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">備考</p>
            <p style="margin:0;font-size:12px;color:#444;line-height:1.7;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${est.notes}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ""}

  <!-- Sender -->
  <tr>
    <td style="padding:24px 40px 20px;margin-top:8px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #ebebeb;padding-top:20px;">
        <tr><td style="height:20px;">&nbsp;</td></tr>
        <tr>
          <td>
            <p style="margin:0;font-size:11px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;">合同会社SIN JAPAN</p>
            <p style="margin:6px 0 0;font-size:10px;color:#aaa;line-height:1.9;font-family:Helvetica,Arial,sans-serif;">〒243-0303 神奈川県愛甲郡愛川町中津7287<br>Tel 050-5526-9906　Fax 046-212-2326　info@sinjapanai.site</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#000;padding:14px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td><p style="margin:0;font-size:9px;color:#555;font-family:Helvetica,Arial,sans-serif;">このメールは合同会社SIN JAPANより送信されています。</p></td>
          <td align="right"><p style="margin:0;font-size:10px;font-weight:700;color:#333;font-family:Helvetica,Arial,sans-serif;letter-spacing:.1em;">SIN JAPAN</p></td>
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
