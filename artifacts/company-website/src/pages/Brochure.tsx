import { useEffect } from "react";
import { useLocation } from "wouter";
import { Printer, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

// ── Data — aligned exactly with website content ──────────────────

const SERVICES = [
  {
    number: "01",
    title: "AI導入",
    subtitle: "AI Implementation",
    description: "企業の業務プロセスを分析し、最適なAIソリューションを選定・導入します。生成AI・LLMの活用から社内業務の自動化まで、現場に根付くAI実装を一貫してサポートします。",
    items: ["現状分析・課題整理", "AIツール選定・導入設計", "社内展開・定着支援", "効果測定・改善"],
    detail: "既製のAIツールを貴社の業務フローに最適な形で組み合わせます。ChatGPT Enterprise・Microsoft Copilot・Google Workspace AIなどのエンタープライズ向けツールから、業務特化型SaaSまで幅広く対応。導入後の定着支援と効果測定まで責任を持ってサポートします。",
  },
  {
    number: "02",
    title: "AI開発",
    subtitle: "AI Development",
    description: "お客様固有の課題に対して、オーダーメイドのAIシステムを開発します。独自モデルの構築から既存システムへのAI組み込みまで、技術力で価値を創出します。",
    items: ["要件定義・アーキテクチャ設計", "カスタムAIモデル開発", "API・システム連携開発", "保守・継続的改善"],
    detail: "GPT-4・Claude・Geminiなどの最新LLMをベースに、貴社専用のファインチューニングやRAG（検索拡張生成）システムを構築します。既存の基幹システムとのシームレスな連携も得意領域です。アジャイル開発で素早く成果を出しながら、継続的に改善します。",
  },
];

const FEATURES = [
  {
    num: "01",
    title: "豊富な実績",
    description: "金融から製造、小売まで、多様な業界における500社以上のAI導入プロジェクトを成功に導いてきました。実践的な知見が私たちの強みです。",
    detail: "業界を横断した豊富な実績により、他社では気づきにくい業界特有の落とし穴を事前に回避。最短ルートでROIを実現するノウハウを蓄積しています。",
  },
  {
    num: "02",
    title: "最先端技術",
    description: "日々進化するAI技術を常にキャッチアップ。最新の論文やアルゴリズムを検証し、お客様のビジネスに実用可能な形で提供します。",
    detail: "社内の研究チームが最新AI論文を継続的にレビュー。実験的な技術は社内PoC環境で事前検証し、実用性が確認された技術のみをプロジェクトに採用します。",
  },
  {
    num: "03",
    title: "手厚いサポート",
    description: "「作って終わり」ではありません。PoCから運用・保守・社内定着化まで、専任チームが長期的に伴走します。",
    detail: "専任カスタマーサクセスチームが導入後も定期的にレビューミーティングを実施。KPIの進捗確認から追加改善提案まで、成果にコミットした長期パートナーシップを提供します。",
  },
];

const CASES = [
  {
    industry: "運送業",
    company: "大手物流会社",
    title: "配送ルート最適化AIで燃料コストを年間15%削減",
    tags: ["AI開発", "最適化", "コスト削減"],
    desc: "数百台規模の車両の配送ルートをリアルタイム最適化。交通情報・天候・積載量を考慮したAIが最適ルートを提案し、燃料コストと配送時間を大幅削減しました。",
  },
  {
    industry: "人材業",
    company: "人材紹介会社",
    title: "AIマッチングエンジン導入で成約率が2.3倍に向上",
    tags: ["AI導入", "マッチング", "LLM"],
    desc: "求職者と求人のマッチング精度をLLMで大幅向上。自然言語で記載されたスキル・志向・文化適合性を多次元で分析し、従来比2.3倍の成約率を実現しました。",
  },
  {
    industry: "建設業",
    company: "総合建設会社",
    title: "現場の安全管理AIで労働災害リスクを50%低減",
    tags: ["AI開発", "画像認識", "安全管理"],
    desc: "工事現場に設置したカメラ映像をリアルタイム解析。ヘルメット未着用・危険エリア侵入をAIが即時検知してアラートを発報し、労働災害リスクを50%低減しました。",
  },
  {
    industry: "製造業",
    company: "大手製造メーカー",
    title: "生産ラインの異常検知AIで不良品率を60%削減",
    tags: ["AI開発", "品質管理", "画像認識"],
    desc: "製造ラインに設置した高解像度カメラとAI画像認識により、微細な傷・変形・色ムラをミリ秒単位で検知。人による目視検査では見落としていた不良を早期発見し、60%削減を達成しました。",
  },
  {
    industry: "金融業",
    company: "地方銀行",
    title: "AIチャットボット導入でオペレーター対応工数を40%削減",
    tags: ["AI導入", "LLM", "業務効率化"],
    desc: "顧客からの問い合わせ対応にRAGベースのAIチャットボットを導入。行内規程・商品情報を学習させ、24時間対応と専門的な回答を実現。オペレーター工数を40%削減しました。",
  },
  {
    industry: "小売業",
    company: "ECプラットフォーム",
    title: "需要予測AIで在庫ロスを年間2億円削減",
    tags: ["AI開発", "需要予測", "在庫最適化"],
    desc: "過去の販売データ・トレンド・季節性・外部イベントをAIが学習し、SKUレベルの需要を高精度予測。過剰在庫と欠品を同時に解決し、在庫ロスを年間2億円削減しました。",
  },
];

const PARTNER_TYPES = [
  {
    type: "紹介パートナー",
    en: "Referral Partner",
    description: "お客様をご紹介いただくだけのシンプルなパートナーシップ。既存のネットワークを活かし、ご紹介いただいた案件の成約時に紹介料をお支払いします。特別な知識や準備は不要です。",
    benefits: ["成約時に紹介料をお支払い", "複雑な手続き不要", "専任担当者がサポート"],
  },
  {
    type: "代理店パートナー",
    en: "Agency Partner",
    description: "SIN JAPAN AIのサービスを自社ブランドとして販売できる、より深いパートナーシップ。専用の営業ツールや研修プログラムを提供し、貴社のビジネス拡大を全力で支援します。",
    benefits: ["マージンによる継続収益", "専用営業資料・研修を提供", "共同マーケティング支援"],
  },
];

const FLOW = [
  { step: "01", title: "無料相談", desc: "課題・ご要望をヒアリング。ゴールと現状を共有ください。対面・オンライン・電話どのスタイルでも対応します。" },
  { step: "02", title: "提案・見積", desc: "1〜2週間以内に提案書・概算見積をご提出します。技術的な根拠とROI試算を明示します。" },
  { step: "03", title: "契約・キックオフ", desc: "合意後、専任チームを組成しプロジェクト開始です。KPI・マイルストーン・体制を確認します。" },
  { step: "04", title: "開発・実装", desc: "アジャイル開発で2〜4週サイクルで成果物をご確認いただけます。定期報告で進捗を可視化します。" },
  { step: "05", title: "運用・継続改善", desc: "本番稼働後もサポート。データに基づき継続的にモデルと機能を改善します。月次レポートを提供します。" },
];

// ── Component ────────────────────────────────────────────────────

export default function Brochure() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "合同会社SIN JAPAN — 会社・サービス紹介資料 2026";
    return () => { document.title = "SIN JAPAN AI"; };
  }, []);

  return (
    <>
      {/* Toolbar */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 flex items-center justify-between px-6 h-14 shadow-sm">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> トップへ戻る
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">合同会社SIN JAPAN — 会社・サービス紹介資料 2026</span>
          <button onClick={() => window.print()} className="flex items-center gap-2 h-8 px-4 bg-gray-900 text-white text-xs font-bold hover:bg-gray-700 transition-colors">
            <Printer className="w-3.5 h-3.5" /> PDFで保存
          </button>
        </div>
      </div>

      <div className="mt-14 print:mt-0 bg-white text-gray-900">

        {/* ── P1: Cover ─────────────────────────────────── */}
        <div className="print-page bg-gray-950 text-white min-h-screen flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="relative flex-1 flex flex-col justify-between p-16 md:p-24">
            <div>
              <p className="text-[10px] font-bold tracking-[0.35em] text-gray-600 uppercase mb-16">Company & Service Brochure 2026</p>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8">
                AIを組織に実装し<br />
                <span className="text-gray-400">持続可能な</span><br />
                <span className="text-gray-400">社会を創る。</span>
              </h1>
              <p className="text-gray-400 text-base max-w-lg leading-relaxed mt-6">
                AI導入支援・AIシステム開発<br />
                企業のAI実装を一気通貫で伴走支援します。
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-white/10 pt-10">
              <div>
                <p className="text-3xl font-black mb-1">合同会社SIN JAPAN</p>
                <p className="text-gray-500 text-sm font-mono tracking-widest">SIN JAPAN LLC</p>
              </div>
              <div className="text-right text-xs text-gray-600 font-mono leading-relaxed">
                <p>2026年3月</p>
                <p>Ver. 1.0</p>
                <p className="mt-1">info@sinjapan.jp</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── P2: TOC + Company Overview ────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-16">
            {/* TOC */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-8">Contents</p>
              <div className="flex flex-col gap-0">
                {[
                  ["01", "会社概要・ミッション"],
                  ["02", "事業内容・サービス"],
                  ["03", "選ばれる理由"],
                  ["04", "導入事例"],
                  ["05", "ご支援の流れ"],
                  ["06", "パートナープログラム"],
                  ["07", "お問い合わせ"],
                ].map(([n, t]) => (
                  <div key={n} className="flex items-center gap-5 py-4 border-b border-gray-100">
                    <span className="text-xs font-mono text-gray-300 w-6">{n}</span>
                    <span className="text-sm font-bold text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Company overview */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-8">Section 01 — 会社概要</p>
              <table className="w-full text-sm mb-8">
                <tbody>
                  {[
                    ["社名", "合同会社SIN JAPAN"],
                    ["英文社名", "SIN JAPAN LLC"],
                    ["設立", "2024年"],
                    ["代表", "—"],
                    ["所在地", "神奈川県愛甲郡愛川町中津7287"],
                    ["TEL", "050-5526-9906 / 046-212-2325"],
                    ["FAX", "046-212-2326"],
                    ["Mail", "info@sinjapan.jp"],
                    ["許認可", "関自貨第560号 / 14-ユ-302475"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-400 text-xs w-24">{k}</td>
                      <td className="py-2.5 font-bold text-xs">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-950 text-white p-6">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase mb-2">Mission</p>
                <p className="text-lg font-black leading-snug">AIを組織に実装し、<br />持続可能な社会を創る。</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── P3: Services ──────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 02</p>
          <h2 className="text-3xl font-black mb-3">事業内容・サービス</h2>
          <p className="text-sm text-gray-400 mb-12">2つの柱でお客様のAI実装を一気通貫でサポートします</p>

          <div className="flex flex-col gap-8">
            {SERVICES.map((s) => (
              <div key={s.number} className="border border-gray-100 p-10">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-6xl font-black text-gray-100 leading-none">{s.number}</span>
                      <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase border border-gray-200 px-2 py-0.5">{s.subtitle}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-4">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.description}</p>
                    <ul className="flex flex-col gap-2">
                      {s.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                          <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6">
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">Detail</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── P4: Why Choose Us (=Features) ─────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 03</p>
          <h2 className="text-3xl font-black mb-3">SIN JAPAN AIが選ばれる理由</h2>
          <p className="text-sm text-gray-400 mb-12">Why Choose Us</p>

          <div className="grid grid-cols-3 gap-px bg-gray-200">
            {FEATURES.map(f => (
              <div key={f.num} className="bg-white p-10 flex flex-col gap-5">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-400">{f.num}</span>
                <div className="w-8 h-px bg-gray-900" />
                <h3 className="text-xl font-black">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">{f.detail}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 bg-gray-950 text-white grid grid-cols-3 divide-x divide-white/10">
            {[
              { n: "500社+", l: "導入実績企業数", sub: "※2026年2月時点" },
              { n: "100%", l: "顧客満足度", sub: "※社内アンケート調査より" },
              { n: "2024年", l: "設立", sub: "※SIN JAPAN AI 創業" },
            ].map(s => (
              <div key={s.l} className="p-8 text-center">
                <p className="text-4xl font-black mb-1" style={{ color: "#b0b8c1" }}>{s.n}</p>
                <p className="text-xs text-gray-400 font-bold tracking-wider mb-0.5">{s.l}</p>
                <p className="text-[9px] text-gray-600">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── P5: Case Studies ──────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 04</p>
          <h2 className="text-3xl font-black mb-3">導入事例</h2>
          <p className="text-sm text-gray-400 mb-12">Case Studies — 多様な業界での実績</p>

          <div className="grid grid-cols-2 gap-6">
            {CASES.map(c => (
              <div key={c.title} className="border border-gray-100 p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase border border-gray-200 px-2 py-0.5">{c.industry}</span>
                  <span className="text-[9px] text-gray-400">{c.company}</span>
                </div>
                <h3 className="text-sm font-black leading-snug">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-gray-50">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── P6: Flow ──────────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 05</p>
          <h2 className="text-3xl font-black mb-12">ご支援の流れ</h2>

          <div className="flex flex-col gap-0">
            {FLOW.map((f, i) => (
              <div key={f.step} className={`flex items-start gap-10 p-8 ${i % 2 === 0 ? "bg-gray-50" : "bg-white border-y border-gray-100"}`}>
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <span className="text-4xl font-black text-gray-200 leading-none w-16 text-center">{f.step}</span>
                  {i < FLOW.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-black mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-gray-900 p-8 flex items-center justify-between gap-8">
            <div>
              <p className="font-black text-base mb-1">まずは無料相談から</p>
              <p className="text-sm text-gray-500">お気軽にご連絡ください。ご状況に合わせた最適なプランをご提案します。初回のご相談は完全無料です。</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">TEL</p>
              <p className="font-black text-sm">050-5526-9906</p>
              <p className="text-xs text-gray-400 mt-1">Mail</p>
              <p className="font-black text-xs">info@sinjapan.jp</p>
            </div>
          </div>
        </div>

        {/* ── P7: Partners ──────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 06</p>
          <h2 className="text-3xl font-black mb-3">パートナープログラム</h2>
          <p className="text-sm text-gray-400 mb-12">SIN JAPAN AIでは、共にAI普及を推進するパートナー企業を募集しています。ビジネスモデルに合わせた2つのプログラムをご用意しています。</p>

          <div className="grid grid-cols-2 gap-8">
            {PARTNER_TYPES.map(p => (
              <div key={p.type} className="border border-gray-100 p-10 flex flex-col gap-6">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">{p.en}</p>
                  <h3 className="text-2xl font-black">{p.type}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                <ul className="flex flex-col gap-3 mt-auto">
                  {p.benefits.map(b => (
                    <li key={b} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 p-8">
            <p className="text-sm font-black mb-2">パートナーへのお問い合わせ</p>
            <p className="text-sm text-gray-500">パートナーシップに関するご相談は、下記よりお気軽にお問い合わせください。</p>
            <p className="text-sm font-bold mt-3">info@sinjapan.jp <span className="text-gray-400 font-normal mx-2">|</span> 050-5526-9906</p>
          </div>
        </div>

        {/* ── P8: Contact ───────────────────────────────── */}
        <div className="print-page bg-gray-950 text-white px-16 md:px-24 py-16">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-2">Section 07</p>
          <h2 className="text-3xl font-black mb-12">お問い合わせ</h2>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <p className="text-gray-400 text-sm leading-relaxed mb-10">
                AI導入のご相談・本資料に関するお問い合わせは、<br />
                下記までお気軽にご連絡ください。<br />
                初回のご相談は無料です。<br />
                2営業日以内にご返信いたします。
              </p>
              <div className="flex flex-col gap-4">
                {[
                  ["会社名", "合同会社SIN JAPAN"],
                  ["Tel", "050-5526-9906 / 046-212-2325"],
                  ["Fax", "046-212-2326"],
                  ["Mail", "info@sinjapan.jp"],
                  ["Web", "sinjapan.jp"],
                  ["所在地", "神奈川県愛甲郡愛川町中津7287"],
                  ["許認可", "関自貨第560号 / 14-ユ-302475"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-6 text-sm border-b border-white/5 pb-4">
                    <span className="text-gray-600 w-16 flex-shrink-0 text-xs">{k}</span>
                    <span className="font-bold text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="border border-white/10 p-8">
                <p className="text-[9px] text-gray-500 tracking-widest uppercase mb-4">お問い合わせ方法</p>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-xs font-black mb-1">Webフォーム</p>
                    <p className="text-xs text-gray-400 leading-relaxed">サイトのお問い合わせフォームより、「無料相談希望」とご記入のうえ送信ください。</p>
                    <p className="text-xs font-bold mt-2 text-gray-300">sinjapan.jp/#contact</p>
                  </div>
                  <div className="border-t border-white/5 pt-5">
                    <p className="text-xs font-black mb-1">お電話</p>
                    <p className="text-xs text-gray-400 leading-relaxed">平日 9:00〜18:00</p>
                    <p className="text-xs font-bold mt-2 text-gray-300">050-5526-9906</p>
                  </div>
                  <div className="border-t border-white/5 pt-5">
                    <p className="text-xs font-black mb-1">メール</p>
                    <p className="text-xs text-gray-400 leading-relaxed">24時間受付。2営業日以内にご返信します。</p>
                    <p className="text-xs font-bold mt-2 text-gray-300">info@sinjapan.jp</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
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

      {/* Float print button */}
      <div className="print:hidden fixed bottom-6 right-6">
        <button onClick={() => window.print()} className="flex items-center gap-2 h-12 px-6 bg-gray-900 text-white text-sm font-bold shadow-2xl hover:bg-gray-700 transition-colors">
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
