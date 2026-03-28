import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    industry: "製造業",
    company: "大手製造メーカー",
    title: "生産ラインの異常検知AIで不良品率を60%削減",
    tags: ["AI開発", "画像認識", "品質管理"],
  },
  {
    industry: "金融",
    company: "地方銀行",
    title: "AIチャットボット導入でオペレーター対応工数を40%削減",
    tags: ["AI導入", "LLM", "業務効率化"],
  },
  {
    industry: "小売",
    company: "ECプラットフォーム",
    title: "需要予測AIで在庫ロスを年間2億円削減",
    tags: ["AI開発", "需要予測", "在庫最適化"],
  },
];

export function CaseStudies() {
  return (
    <section id="cases" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Case Studies</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">導入事例</h2>
          </div>
          <a href="#contact" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            全件を見る <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group border border-gray-100 p-8 flex flex-col gap-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">{c.industry}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-xs text-gray-400">{c.company}</p>
              <h3 className="text-lg font-black text-gray-900 leading-snug">{c.title}</h3>
              <div className="flex flex-wrap gap-2 mt-auto">
                {c.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold tracking-wider px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
