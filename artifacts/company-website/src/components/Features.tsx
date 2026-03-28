import { motion } from "framer-motion";
import { Award, Zap, HeartHandshake } from "lucide-react";

const FEATURES = [
  {
    num: "01",
    icon: Award,
    title: "豊富な実績",
    description: "金融から製造、小売まで、多様な業界における200社以上のAI導入プロジェクトを成功に導いてきました。実践的な知見が私たちの強みです。"
  },
  {
    num: "02",
    icon: Zap,
    title: "最先端技術",
    description: "日々進化するAI技術を常にキャッチアップ。最新の論文やアルゴリズムを検証し、お客様のビジネスに実用可能な形で提供します。"
  },
  {
    num: "03",
    icon: HeartHandshake,
    title: "手厚いサポート",
    description: "「作って終わり」ではありません。PoC（概念実証）から運用、保守、そして社内定着化まで、専任チームが長期的に伴走します。"
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-[#f8f9fa] border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Why Choose Us</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">SIN JAPAN AIが選ばれる理由</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col relative py-12 md:py-0 md:px-12 group"
            >
              <div className="absolute top-4 left-4 md:top-0 md:left-12 text-8xl font-black text-gray-100 z-0 select-none group-hover:text-gray-200 transition-colors duration-300">
                {feature.num}
              </div>
              <div className="relative z-10 flex flex-col pt-8">
                <div className="w-14 h-14 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
