import { motion } from "framer-motion";

const FEATURES = [
  {
    num: "01",
    title: "豊富な実績",
    description: "金融から製造、小売まで、多様な業界における200社以上のAI導入プロジェクトを成功に導いてきました。実践的な知見が私たちの強みです。"
  },
  {
    num: "02",
    title: "最先端技術",
    description: "日々進化するAI技術を常にキャッチアップ。最新の論文やアルゴリズムを検証し、お客様のビジネスに実用可能な形で提供します。"
  },
  {
    num: "03",
    title: "手厚いサポート",
    description: "「作って終わり」ではありません。PoCから運用・保守・社内定着化まで、専任チームが長期的に伴走します。"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">SIN JAPAN AIが選ばれる理由</h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-[#f8f9fa] p-10 flex flex-col gap-6 group hover:bg-white transition-colors duration-300"
            >
              {/* Number */}
              <span className="text-xs font-bold tracking-[0.2em] text-gray-400">{feature.num}</span>

              {/* Accent line */}
              <div className="w-8 h-px bg-gray-900 group-hover:w-16 transition-all duration-500" />

              {/* Title */}
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
