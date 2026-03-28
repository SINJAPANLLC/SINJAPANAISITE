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
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-3">Why Choose Us</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">NEXUS.AIが選ばれる理由</h3>
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
              <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg">
                <feature.icon className="w-10 h-10 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
