import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const NEWS_ITEMS = [
  {
    date: "2026.03.15",
    category: "プレスリリース",
    title: "SIN JAPAN AI、シリーズAラウンドにて5億円の資金調達を実施",
  },
  {
    date: "2026.02.28",
    category: "サービス",
    title: "AI導入支援パッケージ「AI QUICK START」の提供を開始",
  },
  {
    date: "2026.02.10",
    category: "受賞",
    title: "「AI PRODUCTS NEXT AI TREND 2026」AIエージェント部門を受賞",
  },
  {
    date: "2026.01.20",
    category: "導入事例",
    title: "大手製造メーカーへの生産ライン異常検知AI導入事例を公開",
  },
];

export function News() {
  return (
    <section id="news" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">News</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">お知らせ</h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            全件を見る <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* News List */}
        <div className="flex flex-col divide-y divide-gray-200">
          {NEWS_ITEMS.map((item, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-8 py-6 hover:bg-white px-4 -mx-4 transition-colors duration-200"
            >
              <span className="text-xs text-gray-400 font-mono flex-shrink-0 w-24">{item.date}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 border border-gray-200 px-2 py-0.5 flex-shrink-0">
                {item.category}
              </span>
              <span className="text-sm font-bold text-gray-800 group-hover:text-black transition-colors flex-1">
                {item.title}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 hidden md:block flex-shrink-0" />
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
