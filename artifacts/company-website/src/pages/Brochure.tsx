import { useEffect } from "react";
import { useLocation } from "wouter";
import { Printer, ArrowLeft, CheckCircle2, ArrowRight, TrendingUp, Shield, Zap, Users, Code2, BarChart3 } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────

const SERVICES = [
  {
    number: "01",
    title: "AI導入",
    subtitle: "AI Implementation",
    description: "企業の業務プロセスを分析し、最適なAIソリューションを選定・導入します。生成AI・LLMの活用から社内業務の自動化まで、現場に根付くAI実装を一貫してサポートします。",
    items: ["現状分析・課題整理", "AIツール選定・導入設計", "社内展開・定着支援", "効果測定・改善"],
    detail: "既製のAIツールを貴社の業務フローに最適な形で組み合わせます。ChatGPT Enterprise・Microsoft Copilot・Google Workspace AIなどのエンタープライズ向けツールから、業務特化型SaaSまで幅広く対応。導入後の定着支援と効果測定まで責任を持ってサポートします。",
    suitable: ["AIを試してみたいが何から始めるべきかわからない", "特定業務の効率化を早期に実現したい", "社内にAIエンジニアがいない", "まずは低コストでROIを確認したい"],
    tools: ["ChatGPT Enterprise", "Microsoft Copilot", "Google Workspace AI", "Notion AI", "Salesforce Einstein", "HubSpot AI"],
    price: "月額 ¥300,000〜",
    period: "3〜6ヶ月",
  },
  {
    number: "02",
    title: "AI開発",
    subtitle: "AI Development",
    description: "お客様固有の課題に対して、オーダーメイドのAIシステムを開発します。独自モデルの構築から既存システムへのAI組み込みまで、技術力で価値を創出します。",
    items: ["要件定義・アーキテクチャ設計", "カスタムAIモデル開発", "API・システム連携開発", "保守・継続的改善"],
    detail: "GPT-4・Claude・Geminiなどの最新LLMをベースに、貴社専用のファインチューニングやRAG（検索拡張生成）システムを構築します。既存の基幹システムとのシームレスな連携も得意領域です。アジャイル開発で素早く成果を出しながら、継続的に改善します。",
    suitable: ["競合優位性となるAIシステムを自社で保有したい", "既存システムにAI機能を追加したい", "独自データを活用した高精度モデルが必要", "長期的にAI資産を蓄積したい"],
    tools: ["GPT-4 / Claude / Gemini", "LangChain / LlamaIndex", "Pinecone / Chroma (ベクトルDB)", "AWS / GCP / Azure", "FastAPI / Next.js", "PostgreSQL / MongoDB"],
    price: "¥2,000,000〜（要件による）",
    period: "3ヶ月〜1年",
  },
];

const FEATURES = [
  {
    num: "01",
    title: "豊富な実績",
    description: "金融から製造、小売まで、多様な業界における500社以上のAI導入プロジェクトを成功に導いてきました。実践的な知見が私たちの強みです。",
    detail: "業界を横断した豊富な実績により、他社では気づきにくい業界特有の落とし穴を事前に回避。最短ルートでROIを実現するノウハウを蓄積しています。",
    icon: TrendingUp,
  },
  {
    num: "02",
    title: "最先端技術",
    description: "日々進化するAI技術を常にキャッチアップ。最新の論文やアルゴリズムを検証し、お客様のビジネスに実用可能な形で提供します。",
    detail: "社内の研究チームが最新AI論文を継続的にレビュー。実験的な技術は社内PoC環境で事前検証し、実用性が確認された技術のみをプロジェクトに採用します。",
    icon: Zap,
  },
  {
    num: "03",
    title: "手厚いサポート",
    description: "「作って終わり」ではありません。PoCから運用・保守・社内定着化まで、専任チームが長期的に伴走します。",
    detail: "専任カスタマーサクセスチームが導入後も定期的にレビューミーティングを実施。KPIの進捗確認から追加改善提案まで、成果にコミットした長期パートナーシップを提供します。",
    icon: Shield,
  },
];

const CASES = [
  {
    industry: "運送業",
    company: "大手物流会社",
    title: "配送ルート最適化AIで燃料コストを年間15%削減",
    tags: ["AI開発", "最適化", "コスト削減"],
    desc: "数百台規模の車両の配送ルートをリアルタイム最適化。交通情報・天候・積載量を考慮したAIが最適ルートを提案し、燃料コストと配送時間を大幅削減しました。",
    result: "燃料費 -15% / 配送時間 -18%",
    duration: "4ヶ月",
  },
  {
    industry: "人材業",
    company: "人材紹介会社",
    title: "AIマッチングエンジン導入で成約率が2.3倍に向上",
    tags: ["AI導入", "マッチング", "LLM"],
    desc: "求職者と求人のマッチング精度をLLMで大幅向上。自然言語で記載されたスキル・志向・文化適合性を多次元で分析し、従来比2.3倍の成約率を実現しました。",
    result: "成約率 ×2.3倍 / 担当者工数 -35%",
    duration: "3ヶ月",
  },
  {
    industry: "建設業",
    company: "総合建設会社",
    title: "現場の安全管理AIで労働災害リスクを50%低減",
    tags: ["AI開発", "画像認識", "安全管理"],
    desc: "工事現場に設置したカメラ映像をリアルタイム解析。ヘルメット未着用・危険エリア侵入をAIが即時検知してアラートを発報し、労働災害リスクを50%低減しました。",
    result: "災害リスク -50% / ヒヤリハット件数 -62%",
    duration: "5ヶ月",
  },
  {
    industry: "製造業",
    company: "大手製造メーカー",
    title: "生産ラインの異常検知AIで不良品率を60%削減",
    tags: ["AI開発", "品質管理", "画像認識"],
    desc: "製造ラインに設置した高解像度カメラとAI画像認識により、微細な傷・変形・色ムラをミリ秒単位で検知。人による目視検査では見落としていた不良を早期発見しました。",
    result: "不良品率 -60% / 検査コスト -45%",
    duration: "6ヶ月",
  },
  {
    industry: "金融業",
    company: "地方銀行",
    title: "AIチャットボット導入でオペレーター対応工数を40%削減",
    tags: ["AI導入", "LLM", "業務効率化"],
    desc: "顧客からの問い合わせ対応にRAGベースのAIチャットボットを導入。行内規程・商品情報を学習させ、24時間対応と専門的な回答を実現しました。",
    result: "対応工数 -40% / 顧客満足度スコア +12pt",
    duration: "3ヶ月",
  },
  {
    industry: "小売業",
    company: "ECプラットフォーム",
    title: "需要予測AIで在庫ロスを年間2億円削減",
    tags: ["AI開発", "需要予測", "在庫最適化"],
    desc: "過去の販売データ・トレンド・季節性・外部イベントをAIが学習し、SKUレベルの需要を高精度予測。過剰在庫と欠品を同時に解決しました。",
    result: "在庫ロス -¥200M/年 / 欠品率 -28%",
    duration: "5ヶ月",
  },
];

const PARTNER_TYPES = [
  {
    type: "紹介パートナー",
    en: "Referral Partner",
    description: "お客様をご紹介いただくだけのシンプルなパートナーシップ。既存のネットワークを活かし、ご紹介いただいた案件の成約時に紹介料をお支払いします。特別な知識や準備は不要です。",
    benefits: ["成約時に紹介料をお支払い", "複雑な手続き不要", "専任担当者がサポート"],
    suitable: "コンサルタント・士業・業界ネットワークを持つ方",
  },
  {
    type: "代理店パートナー",
    en: "Agency Partner",
    description: "SIN JAPAN AIのサービスを自社ブランドとして販売できる、より深いパートナーシップ。専用の営業ツールや研修プログラムを提供し、貴社のビジネス拡大を全力で支援します。",
    benefits: ["マージンによる継続収益", "専用営業資料・研修を提供", "共同マーケティング支援"],
    suitable: "IT企業・システムインテグレーター・コンサルティング会社",
  },
];

const FLOW = [
  { step: "01", title: "無料相談（0円）", desc: "課題・ご要望をヒアリング。ゴールと現状を共有ください。対面・オンライン・電話どのスタイルでも対応します。所要時間は60〜90分程度です。", days: "Day 1" },
  { step: "02", title: "提案・見積（1〜2週間）", desc: "ヒアリング内容をもとに、提案書・概算見積をご提出します。技術的根拠とROI試算を明示。疑問点はいつでも質問いただけます。", days: "Week 1-2" },
  { step: "03", title: "契約・キックオフ（合意後すぐ）", desc: "合意後、専任チームを組成しプロジェクト開始です。KPI・マイルストーン・体制を確認する初回キックオフミーティングを実施します。", days: "Week 3" },
  { step: "04", title: "PoC・開発（2〜4週サイクル）", desc: "アジャイル開発で2〜4週サイクルで成果物をご確認いただけます。定例報告で進捗を可視化。フィードバックを素早く反映します。", days: "Month 1-3" },
  { step: "05", title: "本番稼働・運用（継続）", desc: "本番稼働後もサポートを継続。データに基づき継続的にモデルと機能を改善します。月次レポートとKPIレビューを提供します。", days: "Month 4〜" },
];

const FAQ = [
  {
    q: "費用の目安を教えてください",
    a: "AI導入支援は月額30万円〜、AI開発は要件により200万円〜が目安です。初回のご相談・見積は無料ですので、まずはお気軽にご相談ください。予算に応じたスコープ調整も柔軟に対応します。",
  },
  {
    q: "社内にエンジニアやAI人材がいなくても大丈夫ですか？",
    a: "問題ありません。弊社がプロジェクト全体をリードします。ご担当者様はビジネス要件の共有と意思決定に集中いただけます。導入後の社内定着支援・研修プログラムも提供しています。",
  },
  {
    q: "既存の社内システムと連携できますか？",
    a: "はい、対応しています。ERP・CRM・基幹システム・データベースなど、多くのシステムとのAPI連携実績があります。まずは現在のシステム構成をお聞かせください。",
  },
  {
    q: "情報セキュリティ・データの取り扱いは大丈夫ですか？",
    a: "セキュリティを最優先事項として扱います。データは暗号化通信・アクセス制御・最小権限の原則に従って管理します。機密性の高い業務への対応経験も豊富です。NDA締結後にプロジェクトを開始します。",
  },
  {
    q: "どのくらいの期間で成果が出ますか？",
    a: "AI導入支援では最短1〜2ヶ月で初期成果が確認できるケースが多いです。AI開発は3ヶ月でPoCを完了し、6ヶ月で本番稼働が標準的なスケジュールです。スコープや複雑さによって異なります。",
  },
  {
    q: "途中でスコープを変更できますか？",
    a: "はい、アジャイル開発を採用しているため、進行中のフィードバックに基づいた柔軟な変更が可能です。大きなスコープ変更の場合は別途ご相談の上、見積を再提示します。",
  },
  {
    q: "小規模・中小企業でも依頼できますか？",
    a: "はい、規模を問わず対応しています。中小企業こそAI導入による業務効率化の恩恵が大きいと考えています。予算やリソースに合わせた現実的なプランをご提案します。",
  },
  {
    q: "導入後のサポート体制は？",
    a: "本番稼働後も専任のカスタマーサクセス担当が月次でレビューミーティングを実施します。システムの監視・障害対応・機能改善を継続的に提供します。保守契約プランもご用意しています。",
  },
];

const TECH_STACK = [
  {
    category: "大規模言語モデル（LLM）",
    en: "Large Language Models",
    icon: Code2,
    items: [
      { name: "GPT-4o / GPT-4 Turbo", desc: "OpenAI最新モデル。高度な推論・文書生成・コード生成" },
      { name: "Claude 3.5 Sonnet", desc: "Anthropic製。長文処理・安全性に優れた高性能モデル" },
      { name: "Gemini 1.5 Pro", desc: "Google製。マルチモーダル対応・大容量コンテキスト" },
      { name: "オープンソースLLM", desc: "Llama 3・Mistral等、オンプレ環境での運用にも対応" },
    ],
  },
  {
    category: "AIフレームワーク・インフラ",
    en: "Framework & Infrastructure",
    icon: BarChart3,
    items: [
      { name: "LangChain / LlamaIndex", desc: "RAGパイプライン構築・エージェント開発の標準フレームワーク" },
      { name: "Pinecone / Chroma", desc: "高速なベクトルデータベース。社内ドキュメントの意味検索に活用" },
      { name: "AWS / GCP / Azure", desc: "クラウド3大プロバイダー全対応。既存環境に合わせて選定" },
      { name: "Docker / Kubernetes", desc: "コンテナ化・スケーラブルなMLOpsパイプラインを構築" },
    ],
  },
  {
    category: "特化型AI技術",
    en: "Specialized AI",
    icon: Zap,
    items: [
      { name: "画像認識・物体検出", desc: "YOLOv8・Vision Transformer。製造検査・防犯カメラ解析" },
      { name: "需要予測・時系列分析", desc: "Prophet・XGBoost・LSTM。在庫最適化・売上予測" },
      { name: "自然言語処理（NLP）", desc: "感情分析・文書分類・情報抽出・チャットボット開発" },
      { name: "強化学習・最適化", desc: "配送ルート・生産スケジューリング・価格最適化" },
    ],
  },
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
                <p className="mt-1">sinjapan.work</p>
                <p>info@sinjapan.jp</p>
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
                  ["02", "AI市場動向・DX推進の背景"],
                  ["03", "事業内容 — AI導入"],
                  ["04", "事業内容 — AI開発"],
                  ["05", "活用技術・テクノロジースタック"],
                  ["06", "選ばれる理由・実績数値"],
                  ["07", "導入事例（6業界）"],
                  ["08", "導入効果・ROI試算"],
                  ["09", "ご支援の流れ"],
                  ["10", "よくある質問（FAQ）"],
                  ["11", "パートナープログラム"],
                  ["12", "お問い合わせ"],
                ].map(([n, t]) => (
                  <div key={n} className="flex items-center gap-5 py-3.5 border-b border-gray-100">
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
                    ["代表", "大谷 和哉"],
                    ["所在地", "神奈川県愛甲郡愛川町中津7287"],
                    ["TEL", "050-5526-9906 / 046-212-2325"],
                    ["FAX", "046-212-2326"],
                    ["Mail", "info@sinjapan.jp"],
                    ["Web", "sinjapan.work"],
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

        {/* ── P3: Market Context ────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 02</p>
          <h2 className="text-3xl font-black mb-3">AI市場動向・DX推進の背景</h2>
          <p className="text-sm text-gray-400 mb-12">なぜ今、AIへの投資が急務なのか</p>

          {/* Market stats */}
          <div className="grid grid-cols-3 gap-px bg-gray-100 mb-12">
            {[
              { num: "¥8.9兆", unit: "", label: "2030年 国内AI市場規模予測", src: "出所：IDC Japan" },
              { num: "78", unit: "%", label: "AI活用企業の競合との差を感じている割合", src: "出所：McKinsey Global Survey" },
              { num: "3.5", unit: "倍", label: "AI先進企業の売上成長率（非AI企業比）", src: "出所：Accenture 調査" },
            ].map(s => (
              <div key={s.label} className="bg-white p-8 text-center">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-black" style={{ color: "#b0b8c1" }}>{s.num}</span>
                  <span className="text-xl font-bold text-gray-400">{s.unit}</span>
                </div>
                <p className="text-xs font-bold text-gray-600 leading-snug mb-1">{s.label}</p>
                <p className="text-[9px] text-gray-400">{s.src}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="border border-gray-100 p-8">
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-4">AI導入が急務な背景</p>
              <ul className="flex flex-col gap-4">
                {[
                  ["人手不足・労働力減少", "2030年までに約644万人の労働力不足が予測（パーソル総合研究所）。AI・自動化による生産性向上が不可欠です。"],
                  ["競合他社のAI投資加速", "大手企業を中心にAIへの投資が急拡大。先行優位性を確保するウィンドウは今の数年間に限られています。"],
                  ["生成AIの急速な実用化", "ChatGPT登場以降、LLMの精度が劇的に向上。以前はAI化が難しかった業務領域まで自動化できるようになりました。"],
                  ["コスト構造の変化", "クラウドAIサービスの価格低下により、中小企業でもエンタープライズ級のAIを現実的なコストで導入できます。"],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-4">
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black mb-0.5">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-gray-950 text-white p-8">
                <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-4">AI未導入企業が直面するリスク</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "競合に生産性・スピードで後れを取る",
                    "人件費の高騰をカバーできず利益率が低下",
                    "優秀な人材の採用・定着が困難になる",
                    "デジタル化の遅れによる取引機会の喪失",
                    "将来的な大規模リストラのリスクが増大",
                  ].map(r => (
                    <li key={r} className="flex items-start gap-3 text-xs text-gray-300">
                      <span className="w-1 h-1 bg-gray-500 rounded-full flex-shrink-0 mt-1.5" />{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-gray-900 p-8">
                <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-4">SIN JAPAN AIの役割</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  「何から始めればよいかわからない」という状態から、戦略策定・技術実装・社内定着化まで一気通貫で伴走。
                  AI導入の専門家として、最短ルートで成果を出すための最適解をご提供します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── P4: Service 01 AI導入 ─────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 03</p>
          <h2 className="text-3xl font-black mb-1">事業内容</h2>
          <p className="text-sm text-gray-400 mb-12">Service Overview</p>

          {SERVICES.map((s) => (
            <div key={s.number} className="border border-gray-100 p-10 mb-8 last:mb-0">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-7xl font-black text-gray-100 leading-none">{s.number}</span>
                    <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase border border-gray-200 px-2 py-0.5">{s.subtitle}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.description}</p>

                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">提供内容</p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                        <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4">
                      <p className="text-[9px] text-gray-400 font-bold tracking-wider mb-1">目安費用</p>
                      <p className="text-sm font-black">{s.price}</p>
                    </div>
                    <div className="bg-gray-50 p-4">
                      <p className="text-[9px] text-gray-400 font-bold tracking-wider mb-1">標準期間</p>
                      <p className="text-sm font-black">{s.period}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-gray-50 p-6">
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">サービス詳細</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.detail}</p>
                  </div>

                  <div className="border border-gray-100 p-6">
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">こんな企業様に最適</p>
                    <ul className="flex flex-col gap-2">
                      {s.suitable.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">主要ツール・技術</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tools.map(t => (
                        <span key={t} className="text-[9px] font-bold tracking-wide px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── P5: Technology Stack ──────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 05</p>
          <h2 className="text-3xl font-black mb-3">活用技術・テクノロジースタック</h2>
          <p className="text-sm text-gray-400 mb-12">Technology Stack — 最先端技術を実務レベルで提供します</p>

          <div className="flex flex-col gap-8">
            {TECH_STACK.map((cat) => (
              <div key={cat.category} className="border border-gray-100 p-10">
                <div className="flex items-start gap-4 mb-8">
                  <cat.icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">{cat.en}</p>
                    <h3 className="text-xl font-black">{cat.category}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cat.items.map(item => (
                    <div key={item.name} className="flex gap-4 p-5 bg-gray-50">
                      <div>
                        <p className="text-sm font-black mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-950 text-white p-8">
            <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-3">セキュリティへの取り組み</p>
            <div className="grid grid-cols-4 gap-6">
              {[
                ["暗号化通信", "すべての通信はTLS/SSLで暗号化"],
                ["アクセス制御", "最小権限原則・多要素認証を標準適用"],
                ["NDA締結", "プロジェクト開始前に秘密保持契約を締結"],
                ["データ消去", "プロジェクト完了後のデータ完全削除に対応"],
              ].map(([t, d]) => (
                <div key={t}>
                  <p className="text-xs font-black mb-1 text-gray-300">{t}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── P6: Why Choose Us + Stats ─────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 06</p>
          <h2 className="text-3xl font-black mb-3">SIN JAPAN AIが選ばれる理由</h2>
          <p className="text-sm text-gray-400 mb-12">Why Choose Us</p>

          <div className="grid grid-cols-3 gap-px bg-gray-200 mb-8">
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
          <div className="bg-gray-950 text-white grid grid-cols-3 divide-x divide-white/10 mb-8">
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

          {/* Competitive comparison */}
          <div className="border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100">
              <div className="p-4 text-xs font-bold text-gray-400">比較項目</div>
              <div className="p-4 text-xs font-black text-gray-900 text-center border-l border-gray-100">SIN JAPAN AI</div>
              <div className="p-4 text-xs font-bold text-gray-400 text-center border-l border-gray-100">大手コンサル</div>
              <div className="p-4 text-xs font-bold text-gray-400 text-center border-l border-gray-100">フリーランス</div>
            </div>
            {[
              ["スピード・柔軟性", "◎ 最短1ヶ月〜", "△ 3〜6ヶ月〜", "◎ 早い"],
              ["費用対効果", "◎ 中小〜大手対応", "△ 高額", "○ 安い"],
              ["技術力・専門性", "◎ 最新AI特化", "○ 総合的", "△ 個人差大"],
              ["長期サポート体制", "◎ 専任チーム", "○ 担当者制", "× 不安定"],
              ["業種別知見", "◎ 6業界以上", "○ 一部業種", "△ 限定的"],
            ].map(([item, us, big, free]) => (
              <div key={item} className="grid grid-cols-4 border-b border-gray-50 last:border-b-0">
                <div className="p-3.5 text-xs text-gray-600 font-bold">{item}</div>
                <div className="p-3.5 text-xs text-gray-900 font-black text-center border-l border-gray-100 bg-gray-50/50">{us}</div>
                <div className="p-3.5 text-xs text-gray-400 text-center border-l border-gray-100">{big}</div>
                <div className="p-3.5 text-xs text-gray-400 text-center border-l border-gray-100">{free}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── P7: Case Studies ──────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 07</p>
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
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div className="bg-gray-950 text-white p-3 text-center">
                    <p className="text-[9px] text-gray-500 mb-1">成果</p>
                    <p className="text-[10px] font-black text-gray-200">{c.result}</p>
                  </div>
                  <div className="bg-gray-50 p-3 text-center">
                    <p className="text-[9px] text-gray-400 mb-1">期間</p>
                    <p className="text-[10px] font-black">{c.duration}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── P8: ROI ───────────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 08</p>
          <h2 className="text-3xl font-black mb-3">導入効果・ROI試算</h2>
          <p className="text-sm text-gray-400 mb-12">代表的なROI試算例（目安）</p>

          <div className="grid grid-cols-2 gap-8 mb-10">
            {[
              {
                title: "AI業務自動化（書類処理・入力）",
                scenario: "月間500時間の書類処理業務をAIで自動化",
                cost: "¥500,000〜（導入費）+ 月額¥30万〜",
                savings: [
                  ["人件費削減（500h × ¥3,000）", "月 ¥1,500,000"],
                  ["ミス・修正コスト削減", "月 ¥200,000"],
                  ["処理スピード向上による機会損失削減", "月 ¥300,000"],
                ],
                monthly: "月 ¥1,700,000",
                roi: "約0.3ヶ月で回収",
              },
              {
                title: "AIチャットボット（カスタマーサポート）",
                scenario: "月間3,000件の問い合わせ対応を60%自動化",
                cost: "¥1,500,000〜（開発費）+ 月額¥15万〜",
                savings: [
                  ["オペレーター削減（2〜3名分）", "月 ¥600,000"],
                  ["深夜・休日対応コスト削減", "月 ¥200,000"],
                  ["対応品質向上による顧客維持", "月 ¥300,000"],
                ],
                monthly: "月 ¥1,100,000",
                roi: "約1.4ヶ月で回収",
              },
            ].map(roi => (
              <div key={roi.title} className="border border-gray-100 p-8">
                <h3 className="text-base font-black mb-2">{roi.title}</h3>
                <p className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">{roi.scenario}</p>
                <p className="text-[9px] text-gray-400 font-bold tracking-wider mb-2">初期・月額費用目安</p>
                <p className="text-xs font-bold text-gray-700 mb-5">{roi.cost}</p>
                <p className="text-[9px] text-gray-400 font-bold tracking-wider mb-3">想定削減効果</p>
                <div className="flex flex-col gap-2 mb-5">
                  {roi.savings.map(([item, val]) => (
                    <div key={item} className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{item}</span>
                      <span className="font-black text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 text-center">
                    <p className="text-[9px] text-gray-400 mb-1">月間削減合計</p>
                    <p className="text-sm font-black">{roi.monthly}</p>
                  </div>
                  <div className="bg-gray-950 text-white p-4 text-center">
                    <p className="text-[9px] text-gray-500 mb-1">投資回収</p>
                    <p className="text-sm font-black text-gray-200">{roi.roi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-8">
            <p className="text-xs font-black mb-2">免責事項</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              上記のROI試算はあくまで一般的な目安であり、実際の効果は業種・業務内容・導入規模・社内体制などによって大きく異なります。
              貴社の状況に応じた個別のROI試算については、無料相談時にご提示します。
            </p>
          </div>
        </div>

        {/* ── P9: Flow ──────────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 09</p>
          <h2 className="text-3xl font-black mb-12">ご支援の流れ</h2>

          <div className="flex flex-col gap-0 mb-10">
            {FLOW.map((f, i) => (
              <div key={f.step} className={`flex items-start gap-10 p-8 ${i % 2 === 0 ? "bg-gray-50" : "bg-white border-y border-gray-100"}`}>
                <div className="flex flex-col items-center gap-2 flex-shrink-0 w-20">
                  <span className="text-4xl font-black text-gray-200 leading-none text-center">{f.step}</span>
                  <span className="text-[9px] font-mono text-gray-400">{f.days}</span>
                  {i < FLOW.length - 1 && <div className="w-px h-4 bg-gray-200 mt-1" />}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-black mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-900 p-8 flex items-center justify-between gap-8">
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

        {/* ── P10: FAQ ──────────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 10</p>
          <h2 className="text-3xl font-black mb-3">よくある質問</h2>
          <p className="text-sm text-gray-400 mb-12">FAQ — Frequently Asked Questions</p>

          <div className="grid grid-cols-2 gap-px bg-gray-100">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-xl font-black text-gray-200 flex-shrink-0 leading-none">Q</span>
                  <p className="text-sm font-black text-gray-900 leading-snug pt-0.5">{item.q}</p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-xl font-black text-gray-900 flex-shrink-0 leading-none">A</span>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── P11: Partners ─────────────────────────────── */}
        <div className="print-page px-16 md:px-24 py-16 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Section 11</p>
          <h2 className="text-3xl font-black mb-3">パートナープログラム</h2>
          <p className="text-sm text-gray-400 mb-12">SIN JAPAN AIでは、共にAI普及を推進するパートナー企業を募集しています。ビジネスモデルに合わせた2つのプログラムをご用意しています。</p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {PARTNER_TYPES.map(p => (
              <div key={p.type} className="border border-gray-100 p-10 flex flex-col gap-6">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">{p.en}</p>
                  <h3 className="text-2xl font-black">{p.type}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                <div>
                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-3">メリット</p>
                  <ul className="flex flex-col gap-3">
                    {p.benefits.map(b => (
                      <li key={b} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-2">こんな方に最適</p>
                  <p className="text-xs text-gray-500">{p.suitable}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Partner flow */}
          <div className="bg-gray-50 p-8">
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-6">パートナー登録の流れ</p>
            <div className="grid grid-cols-4 gap-4">
              {[
                ["01", "お問い合わせ", "フォームまたはメールでご連絡ください"],
                ["02", "個別面談", "オンラインにてパートナーシップの詳細をご説明"],
                ["03", "契約締結", "パートナー契約・NDAを締結します"],
                ["04", "活動開始", "専用ツール・サポート体制のご案内後、活動スタート"],
              ].map(([n, t, d]) => (
                <div key={n} className="flex flex-col gap-2">
                  <span className="text-2xl font-black text-gray-200">{n}</span>
                  <p className="text-xs font-black">{t}</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── P12: Contact ──────────────────────────────── */}
        <div className="print-page bg-gray-950 text-white px-16 md:px-24 py-16">
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase mb-2">Section 12</p>
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
                  ["代表", "大谷 和哉"],
                  ["Tel", "050-5526-9906 / 046-212-2325"],
                  ["Fax", "046-212-2326"],
                  ["Mail", "info@sinjapan.jp"],
                  ["Web", "sinjapan.work"],
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
                    <p className="text-xs font-bold mt-2 text-gray-300">sinjapan.work/#contact</p>
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
              <div className="border border-white/10 p-8">
                <p className="text-[9px] text-gray-500 tracking-widest uppercase mb-4">相談前に準備いただくと便利なもの</p>
                <ul className="flex flex-col gap-2">
                  {[
                    "現在の業務フロー・課題の概要",
                    "AI化を検討している業務のおおよその規模",
                    "予算・スケジュールのご要望",
                    "既存システム・ツールの一覧（あれば）",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
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
