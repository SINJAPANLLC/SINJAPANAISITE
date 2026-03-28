import { useEffect } from "react";
import { useLocation } from "wouter";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    no: "01",
    title: "AIコンサルティング",
    en: "AI Consulting",
    desc: "経営課題の整理からAI活用戦略の立案まで、貴社のAI化を一気通貫でご支援します。現状分析・ロードマップ設計・KPI設定まで、専門チームが伴走します。",
    points: ["現状分析・課題抽出", "AI活用ロードマップ設計", "ROI試算・KPI設定", "推進体制の構築支援"],
  },
  {
    no: "02",
    title: "AIシステム開発",
    en: "AI System Development",
    desc: "要件定義から実装・運用保守まで、業務に直結するAIシステムをフルスクラッチで開発します。業界特化の知見を活かし、最短で成果を出せるシステムを提供します。",
    points: ["要件定義・設計", "AI/MLモデル構築", "システム実装・テスト", "運用保守・継続改善"],
  },
  {
    no: "03",
    title: "AIアドバイザリー",
    en: "AI Advisory",
    desc: "経営層・管理職向けのAIリテラシー教育から、社内AI推進チームの組成まで支援します。外部CTO/CDOとして、AI経営変革を牽引するアドバイザリーサービスです。",
    points: ["AI経営戦略アドバイス", "社内研修・人材育成", "外部CTO/CDOサービス", "AI政策・規制対応支援"],
  },
  {
    no: "04",
    title: "物流・運送業特化ソリューション",
    en: "Logistics AI Solution",
    desc: "一般貨物・貸切旅客の許認可を有する弊社だからこそ提供できる、物流・運送業界に特化したAIソリューションです。配車最適化・需要予測・コスト削減を実現します。",
    points: ["配車・ルート最適化AI", "需要予測・在庫最適化", "ドライバー稼働管理", "燃費・コスト削減分析"],
  },
];

const CASES = [
  { industry: "製造業", title: "生産ライン異常検知AIの導入", result: "不良品率 68% 削減" },
  { industry: "物流業", title: "AIによる配車最適化システム", result: "配送コスト 23% 削減" },
  { industry: "医療機関", title: "患者データ分析AIの導入", result: "診断補助精度 91% 達成" },
  { industry: "小売業", title: "需要予測・在庫最適化AI", result: "廃棄ロス 45% 削減" },
  { industry: "建設業", title: "現場安全管理AIカメラ", result: "ヒヤリハット検知 300% 向上" },
  { industry: "金融業", title: "不正検知AIシステム", result: "検知精度 99.2% を実現" },
];

const FLOW = [
  { step: "01", title: "無料相談", desc: "課題・ご要望をヒアリング。ゴールと現状を共有ください。" },
  { step: "02", title: "提案・見積", desc: "1〜2週間以内に提案書・概算見積をご提出します。" },
  { step: "03", title: "契約・キックオフ", desc: "合意後、専任チームを組成しプロジェクト開始です。" },
  { step: "04", title: "開発・実装", desc: "アジャイル開発で素早く成果を出し、定期報告を行います。" },
  { step: "05", title: "運用・継続改善", desc: "本番稼働後もサポート。データに基づき継続的に改善します。" },
];

export default function Brochure() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "合同会社SIN JAPAN — 会社・サービス紹介資料";
    return () => { document.title = "SIN JAPAN AI"; };
  }, []);

  return (
    <>
      {/* Print/Back toolbar — hidden in print */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-6 h-14">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> トップへ戻る
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">合同会社SIN JAPAN — 会社・サービス紹介資料 2026</span>
          <button onClick={() => window.print()} className="flex items-center gap-2 h-8 px-4 bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 transition-colors">
            <Printer className="w-3.5 h-3.5" /> PDFで保存
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="mt-14 print:mt-0 bg-white text-gray-900">

        {/* ── Page 1: Cover ─────────────────────────────── */}
        <div className="print-page bg-gray-950 text-white min-h-screen flex flex-col relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="relative flex-1 flex flex-col justify-between p-16 md:p-24">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-12">Company & Service Brochure</p>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                AIを組織に実装し<br />
                <span className="text-gray-400">持続可能な社会を創る</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                AIコンサルティング・AIシステム開発・AIアドバイザリー<br />
                企業のAI実装を一気通貫で伴走支援します。
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div>
                <p className="text-4xl font-black mb-1">合同会社SIN JAPAN</p>
                <p className="text-gray-500 text-sm font-mono">SIN JAPAN LLC</p>
              </div>
              <div className="text-right text-xs text-gray-600 font-mono">
                <p>2026年版</p>
                <p>Ver. 1.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Page 2: Company Overview ────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 01</p>
          <h2 className="text-3xl font-black mb-12">会社概要</h2>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["社名", "合同会社SIN JAPAN"],
                    ["英文社名", "SIN JAPAN LLC"],
                    ["設立", "2024年"],
                    ["所在地", "神奈川県愛甲郡愛川町中津7287"],
                    ["TEL", "050-5526-9906 / 046-212-2325"],
                    ["FAX", "046-212-2326"],
                    ["Mail", "info@sinjapan.jp"],
                    ["許認可", "関自貨第560号 / 14-ユ-302475"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100">
                      <td className="py-3 pr-6 text-gray-400 font-medium w-28 flex-shrink-0">{k}</td>
                      <td className="py-3 font-bold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-gray-950 text-white p-8">
                <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-3">Mission</p>
                <p className="text-xl font-black leading-relaxed">
                  AIを組織に実装し、<br />
                  持続可能な社会を創る。
                </p>
              </div>
              <div className="bg-gray-50 p-8">
                <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-3">Vision</p>
                <p className="text-base font-bold text-gray-700 leading-relaxed">
                  すべての企業がAIを活用し、<br />
                  生産性と創造性が共存する社会の実現
                </p>
              </div>
              <div className="border border-gray-100 p-8">
                <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-3">Value</p>
                <ul className="flex flex-col gap-2 text-sm text-gray-600">
                  {["誠実・透明性を最優先する", "成果にコミットし続ける", "技術と人をつなぐ架け橋になる", "社会的責任を意識した事業推進"].map(v => (
                    <li key={v} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Page 3-4: Services ──────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 02</p>
          <h2 className="text-3xl font-black mb-12">事業内容・サービス</h2>
          <div className="grid grid-cols-2 gap-8">
            {SERVICES.map(s => (
              <div key={s.no} className="border border-gray-100 p-8">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl font-black text-gray-100">{s.no}</span>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase border border-gray-100 px-2 py-0.5">{s.en}</span>
                </div>
                <h3 className="text-lg font-black mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                <ul className="flex flex-col gap-1.5">
                  {s.points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Page 5: Case Studies ────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 03</p>
          <h2 className="text-3xl font-black mb-3">導入事例</h2>
          <p className="text-sm text-gray-400 mb-12">様々な業界でのAI導入実績</p>
          <div className="grid grid-cols-3 gap-6">
            {CASES.map(c => (
              <div key={c.title} className="bg-gray-50 p-6">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">{c.industry}</p>
                <p className="text-sm font-black mb-4 leading-snug">{c.title}</p>
                <div className="bg-gray-900 text-white px-3 py-2 inline-block">
                  <p className="text-xs font-black">{c.result}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-gray-950 text-white p-8 grid grid-cols-3 divide-x divide-white/10">
            {[["50+", "導入実績"], ["98%", "顧客満足度"], ["2024年", "設立"]].map(([n, l]) => (
              <div key={l} className="px-8 first:pl-0">
                <p className="text-4xl font-black mb-1">{n}</p>
                <p className="text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Page 6: Process ─────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 04</p>
          <h2 className="text-3xl font-black mb-12">ご支援の流れ</h2>
          <div className="flex flex-col gap-0">
            {FLOW.map((f, i) => (
              <div key={f.step} className={`flex items-start gap-8 p-8 ${i % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-100"}`}>
                <span className="text-5xl font-black text-gray-100 leading-none flex-shrink-0 w-16">{f.step}</span>
                <div>
                  <h3 className="text-base font-black mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-gray-900 p-8">
            <p className="text-sm font-black mb-2">まずは無料相談から</p>
            <p className="text-sm text-gray-500">お気軽にご連絡ください。ご状況に合わせた最適なプランをご提案します。</p>
          </div>
        </div>

        {/* ── Page 7: Strengths ───────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 05</p>
          <h2 className="text-3xl font-black mb-12">選ばれる理由</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { num: "01", title: "業界特化の知見", desc: "物流・製造・医療・金融など、業界固有の課題に精通した専門チームが担当します。" },
              { num: "02", title: "一気通貫の支援体制", desc: "戦略立案から開発・運用まで、一社で完結。窓口が1つなので意思決定が速い。" },
              { num: "03", title: "結果にコミット", desc: "KPIを事前に合意し、定期的な成果報告で透明性高く進めます。" },
              { num: "04", title: "最新AI技術の活用", desc: "GPT-4/Claude/Geminiなど最新LLMを状況に応じて最適選定・活用します。" },
              { num: "05", title: "スモールスタート対応", desc: "PoC（概念実証）から始め、成果を確認しながらスケールアップできます。" },
              { num: "06", title: "伴走型サポート", desc: "導入後も専任担当が継続的にサポート。社内定着まで責任を持って支援します。" },
            ].map(s => (
              <div key={s.num} className="flex flex-col gap-3">
                <span className="text-4xl font-black text-gray-100">{s.num}</span>
                <h3 className="font-black">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Page 8: Contact ─────────────────────────── */}
        <div className="print-page bg-gray-950 text-white px-16 md:px-24 py-16">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-2">Contact</p>
          <h2 className="text-3xl font-black mb-12">お問い合わせ</h2>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                AI導入のご相談・本資料に関するお問い合わせは、<br />
                下記までお気軽にご連絡ください。<br />
                初回のご相談は無料です。
              </p>
              <div className="flex flex-col gap-4">
                {[
                  ["会社名", "合同会社SIN JAPAN"],
                  ["Tel", "050-5526-9906 / 046-212-2325"],
                  ["Fax", "046-212-2326"],
                  ["Mail", "info@sinjapan.jp"],
                  ["Web", "https://sinjapan.jp"],
                  ["所在地", "神奈川県愛甲郡愛川町中津7287"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-6 text-sm">
                    <span className="text-gray-600 w-16 flex-shrink-0">{k}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="border border-white/10 p-8">
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-4">無料相談の申し込み</p>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Webサイトのお問い合わせフォームより、<br />
                  「無料相談希望」とご記入のうえ送信ください。<br />
                  2営業日以内にご返信いたします。
                </p>
                <p className="text-sm font-black">sinjapan.jp/#contact</p>
              </div>
              <div className="mt-8">
                <p className="text-[9px] text-gray-600 leading-relaxed">
                  本資料に記載の情報は2026年3月現在のものです。<br />
                  記載内容は予告なく変更される場合があります。<br />
                  © 2026 合同会社SIN JAPAN. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Print button (mobile bottom bar) */}
      <div className="print:hidden fixed bottom-6 right-6">
        <button onClick={() => window.print()} className="flex items-center gap-2 h-12 px-6 bg-gray-900 text-white text-sm font-bold shadow-xl hover:bg-gray-700 transition-colors">
          <Printer className="w-4 h-4" /> PDFで保存
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-page { page-break-after: always; min-height: 100vh; }
          .print-page:last-child { page-break-after: avoid; }
        }
      `}</style>
    </>
  );
}
