import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    id: "ai-introduction",
    number: "01",
    title: "AI導入",
    subtitle: "AI Implementation",
    description:
      "企業の業務プロセスを分析し、最適なAIソリューションを選定・導入します。生成AI・LLMの活用から社内業務の自動化まで、現場に根付くAI実装を一貫してサポートします。",
    items: ["現状分析・課題整理", "AIツール選定・導入設計", "社内展開・定着支援", "効果測定・改善"],
  },
  {
    id: "ai-development",
    number: "02",
    title: "AI開発",
    subtitle: "AI Development",
    description:
      "お客様固有の課題に対して、オーダーメイドのAIシステムを開発します。独自モデルの構築から既存システムへのAI組み込みまで、技術力で価値を創出します。",
    items: ["要件定義・アーキテクチャ設計", "カスタムAIモデル開発", "API・システム連携開発", "保守・継続的改善"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">事業概要</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group border border-gray-200 bg-white hover:bg-gray-950 transition-colors duration-300 p-10 flex flex-col gap-8 cursor-pointer"
            >
              {/* Number + Title */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold tracking-[0.15em] text-gray-400 group-hover:text-gray-500 transition-colors">
                    {service.number}
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors mt-1">
                    {service.title}
                  </h3>
                  <p className="text-xs tracking-widest text-gray-400 group-hover:text-gray-500 transition-colors mt-1 uppercase">
                    {service.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 mt-2 flex-shrink-0" />
              </div>

              {/* Description */}
              <p className="text-gray-600 group-hover:text-gray-300 transition-colors leading-relaxed text-sm">
                {service.description}
              </p>

              {/* Item List */}
              <ul className="flex flex-col gap-2 mt-auto">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-gray-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Bottom Link */}
              <a
                href="#contact"
                className="text-xs font-bold tracking-wider text-gray-900 group-hover:text-white transition-colors border-b border-gray-200 group-hover:border-gray-600 pb-0.5 self-start"
              >
                お問い合わせ →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
