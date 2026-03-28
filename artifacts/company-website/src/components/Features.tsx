import { motion } from "framer-motion";
import { Award, Zap, HeartHandshake } from "lucide-react";

const FEATURES = [
  {
    icon: Award,
    title: "豊富な実績",
    description: "金融から製造、小売まで、多様な業界における200社以上のAI導入プロジェクトを成功に導いてきました。実践的な知見が私たちの強みです。"
  },
  {
    icon: Zap,
    title: "最先端技術",
    description: "日々進化するAI技術を常にキャッチアップ。最新の論文やアルゴリズムを検証し、お客様のビジネスに実用可能な形で提供します。"
  },
  {
    icon: HeartHandshake,
    title: "手厚いサポート",
    description: "「作って終わり」ではありません。PoC（概念実証）から運用、保守、そして社内定着化まで、専任チームが長期的に伴走します。"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-3 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">Why Choose Us</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">SIN JAPAN AIが選ばれる理由</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl glass-panel flex items-center justify-center mb-8 border border-primary/20 group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <feature.icon className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform duration-500 relative z-10" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors">{feature.title}</h4>
              <p className="text-foreground/70 leading-relaxed font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
