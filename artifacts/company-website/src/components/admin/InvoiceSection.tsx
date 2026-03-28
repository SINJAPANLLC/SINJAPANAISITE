import { useState } from "react";
import { invoiceStore, type Invoice, type LineItem } from "@/hooks/use-admin-data";
import { Plus, Trash2, X, Eye, Send, Loader2 } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ja-JP");
const calcTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
const TAX = 0.1;
const TOKEN = () => import.meta.env.VITE_ADMIN_PASSWORD || "";

const STATUS_COLORS: Record<Invoice["status"], string> = {
  unpaid: "text-yellow-400", paid: "text-green-400", overdue: "text-red-400",
};
const STATUS_BG: Record<Invoice["status"], string> = {
  unpaid: "bg-yellow-400/10 border-yellow-400/20", paid: "bg-green-400/10 border-green-400/20", overdue: "bg-red-400/10 border-red-400/20",
};
const STATUS_LABELS: Record<Invoice["status"], string> = { unpaid: "未払い", paid: "支払済", overdue: "期限超過" };

function buildInvoiceHtml(inv: Invoice): string {
  const sub = calcTotal(inv.items);
  const tax = Math.floor(sub * TAX);
  const total = sub + tax;
  const rows = inv.items.map(l =>
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
<title>請求書 ${inv.invoiceNo}</title>
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
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.3em;color:#bbb;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">INVOICE</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#000;font-family:Helvetica,Arial,sans-serif;letter-spacing:-.01em;">請求書</p>
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
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.2em;color:#aaa;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">請求先</p>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
              <tr>
                <td style="width:2px;background:#000;padding:0;">&nbsp;</td>
                <td style="padding:0 0 0 14px;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#555;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${inv.company}</p>
                  <p style="margin:3px 0 0;font-size:15px;font-weight:900;color:#000;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${inv.client}&nbsp;<span style="font-size:12px;font-weight:400;color:#666;">様</span></p>
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;border-collapse:collapse;">
              <tr><td style="padding:3px 16px 3px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">請求書番号</td><td style="padding:3px 0;color:#000;font-weight:700;font-family:Helvetica,Arial,sans-serif;">${inv.invoiceNo}</td></tr>
              <tr><td style="padding:3px 16px 3px 0;color:#aaa;font-family:Helvetica,Arial,sans-serif;">請求日</td><td style="padding:3px 0;color:#333;font-family:Helvetica,Arial,sans-serif;">${inv.date}</td></tr>
              <tr><td style="padding:3px 16px 3px 0;font-weight:700;color:#000;font-family:Helvetica,Arial,sans-serif;">お支払期限</td><td style="padding:3px 0;font-weight:700;color:#000;font-family:Helvetica,Arial,sans-serif;">${inv.dueDate}</td></tr>
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
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.2em;color:#888;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">ご請求金額（税込）</p>
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

  ${inv.notes ? `
  <!-- Notes -->
  <tr>
    <td style="padding:16px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-left:2px solid #000;padding-left:14px;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:.2em;color:#aaa;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">備考</p>
            <p style="margin:0;font-size:12px;color:#444;line-height:1.7;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">${inv.notes}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ""}

  <!-- Bank info -->
  <tr>
    <td style="padding:16px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-left:2px solid #000;padding-left:14px;">
            <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:.2em;color:#aaa;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">お振込先</p>
            <p style="margin:0;font-size:12px;color:#444;line-height:1.7;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">担当者よりお振込先をご案内いたします。</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Sender -->
  <tr>
    <td style="padding:24px 40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #ebebeb;">
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

function PreviewModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const html = buildInvoiceHtml(invoice);

  const send = async () => {
    setSending(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": TOKEN() },
        body: JSON.stringify({
          to: invoice.email,
          subject: `【合同会社SIN JAPAN】請求書 ${invoice.invoiceNo} をお送りします`,
          html,
        }),
      });
      invoiceStore.update(invoice.id, { status: "unpaid" });
      setSent(true);
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h3 className="font-black text-sm">請求書プレビュー — {invoice.invoiceNo}</h3>
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
              <iframe srcDoc={html} className="w-full min-h-[520px] bg-white border-0 block" style={{ height: "520px" }} title="invoice preview" />
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
              <p className="text-xs text-gray-500">送信先: <span className="text-white font-mono">{invoice.email}</span></p>
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

export function InvoiceSection() {
  const [items, setItems] = useState<Invoice[]>(() => invoiceStore.getAll());
  const [mode, setMode] = useState<"list" | "create">("list");
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ invoiceNo: "", client: "", company: "", email: "", date: "", dueDate: "", notes: "" });
  const [lines, setLines] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0 }]);

  const addLine = () => setLines([...lines, { description: "", qty: 1, unitPrice: 0 }]);
  const updateLine = (i: number, key: keyof LineItem, val: string | number) =>
    setLines(lines.map((l, idx) => idx === i ? { ...l, [key]: key === "description" ? val : Number(val) } : l));
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));

  const updateStatus = (id: string, status: Invoice["status"]) => {
    invoiceStore.update(id, { status });
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = invoiceStore.add({ ...form, items: lines, status: "unpaid" });
    setItems([item, ...items]);
    setMode("list");
    setLines([{ description: "", qty: 1, unitPrice: 0 }]);
    setForm({ invoiceNo: "", client: "", company: "", email: "", date: "", dueDate: "", notes: "" });
  };

  if (mode === "create") return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">請求書発行</h2>
        <button type="button" onClick={() => setMode("list")} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[["請求書番号", "invoiceNo", "INV-001", "text"], ["顧客名", "client", "山田 太郎", "text"], ["会社名", "company", "株式会社〇〇", "text"],
          ["メール", "email", "email@example.com", "email"], ["請求日", "date", "", "date"], ["支払期限", "dueDate", "", "date"]].map(([label, key, ph, type]) => (
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
          <div className="flex flex-col items-end px-3 py-3 gap-1 text-sm min-w-[480px]">
            <span className="text-gray-400">小計：¥{fmt(calcTotal(lines))}</span>
            <span className="text-gray-400">消費税（10%）：¥{fmt(Math.floor(calcTotal(lines) * TAX))}</span>
            <span className="font-black text-base">合計：¥{fmt(Math.floor(calcTotal(lines) * (1 + TAX)))}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-gray-500 mb-1 block tracking-widest">備考</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full h-20 bg-white/10 border border-white/10 text-white text-sm px-3 py-2 outline-none resize-none" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <button type="submit" className="text-xs font-bold bg-white text-gray-900 px-6 py-2.5 hover:bg-gray-100 transition-colors">発行する</button>
        <button type="button" onClick={() => setMode("list")} className="text-xs text-gray-500 hover:text-white px-3 py-2">キャンセル</button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-6">
      {preview && <PreviewModal invoice={preview} onClose={() => setPreview(null)} />}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-black">請求書管理</h2>
        <button onClick={() => setMode("create")} className="flex items-center gap-2 text-xs font-bold bg-white text-gray-900 px-4 py-2 hover:bg-gray-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> 新規発行
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["unpaid", "paid", "overdue"] as Invoice["status"][]).map(s => {
          const total = items.filter(i => i.status === s).reduce((acc, i) => acc + Math.floor(calcTotal(i.items) * 1.1), 0);
          return (
            <div key={s} className={`border p-4 ${STATUS_BG[s]}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${STATUS_COLORS[s]}`}>{STATUS_LABELS[s]}</p>
              <p className="text-lg font-black">¥{fmt(total)}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{items.filter(i => i.status === s).length}件</p>
            </div>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="border border-white/10 py-16 text-center text-xs text-gray-600">請求書はありません</div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-0.5">{item.invoiceNo}</span>
                    <select value={item.status} onChange={e => updateStatus(item.id, e.target.value as Invoice["status"])}
                      className={`text-[10px] font-bold bg-transparent border-0 outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}>
                      {(["unpaid", "paid", "overdue"] as Invoice["status"][]).map(s => <option key={s} value={s} className="text-black bg-white">{STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <p className="font-black text-base mt-1">{item.client} <span className="text-gray-500 font-normal text-sm">/ {item.company}</span></p>
                  <p className="text-xs text-gray-500">請求日: {item.date}　支払期限: <span className={item.status === "overdue" ? "text-red-400 font-bold" : ""}>{item.dueDate}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-black">¥{fmt(Math.floor(calcTotal(item.items) * 1.1))}<span className="text-xs text-gray-500 font-normal ml-1">（税込）</span></p>
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
