import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PARTNER_TYPES = [
  {
    type: "紹介パートナー",
    en: "Referral Partner",
    description:
      "お客様をご紹介いただくだけのシンプルなパートナーシップ。既存のネットワークを活かし、ご紹介いただいた案件の成約時に紹介料をお支払いします。特別な知識や準備は不要です。",
    benefits: ["成約時に紹介料をお支払い", "複雑な手続き不要", "専任担当者がサポート"],
  },
  {
    type: "代理店パートナー",
    en: "Agency Partner",
    description:
      "SIN JAPAN AIのサービスを自社ブランドとして販売できる、より深いパートナーシップ。専用の営業ツールや研修プログラムを提供し、貴社のビジネス拡大を全力で支援します。",
    benefits: ["マージンによる継続収益", "専用営業資料・研修を提供", "共同マーケティング支援"],
  },
];

export function Partners() {
  return (
    <section id="partners" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Partners</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">パートナー募集</h2>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
            SIN JAPAN AIでは、共にAI普及を推進するパートナー企業を募集しています。
            ビジネスモデルに合わせた2つのプログラムをご用意しています。
          </p>
        </div>

        {/* Partner Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARTNER_TYPES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group border border-gray-100 p-10 flex flex-col gap-6 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">{p.en}</p>
                <h3 className="text-2xl font-black text-gray-900">{p.type}</h3>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>

              <ul className="flex flex-col gap-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors"
              >
                お問い合わせはこちら <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
