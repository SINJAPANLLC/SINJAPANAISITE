import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Code, LineChart, Target } from "lucide-react";

const SERVICES = [
  {
    id: "generative-ai",
    title: "生成AI導入支援",
    description: "ChatGPT等をはじめとする最新のLLMを活用し、社内業務の自動化・効率化を実現するシステムを構築します。",
    icon: Bot,
    image: "service-1.png",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "system-dev",
    title: "AIシステム開発",
    description: "お客様の課題に合わせた独自のAIモデルの開発から、既存システムへのAI組み込みまで、一気通貫でサポートします。",
    icon: Code,
    image: "service-2.png",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "data-analytics",
    title: "データ分析・活用",
    description: "社内に眠る膨大なデータを可視化・分析。機械学習を用いた予測モデルにより、データドリブンな意思決定を支援します。",
    icon: LineChart,
    image: "service-3.png",
    color: "from-cyan-500/20 to-emerald-500/20",
  },
  {
    id: "consulting",
    title: "AI戦略コンサルティング",
    description: "AIを経営戦略にどう組み込むか。ロードマップの策定から組織のAIリテラシー向上まで、専門家が伴走します。",
    icon: Target,
    image: "service-4.png",
    color: "from-orange-500/20 to-red-500/20",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">ビジネスを加速させるAIソリューション</h3>
          <p className="text-muted-foreground text-lg">
            企業の抱える様々な課題に対して、最適なAI技術を選定し、確実な価値提供をお約束します。
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {SERVICES.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} mix-blend-overlay z-10`} />
                  <img
                    src={`${import.meta.env.BASE_URL}images/${service.image}`}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-2xl glass-panel flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-foreground" />
                  </div>
                </div>
                <CardContent className="p-8">
                  <h4 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center text-sm font-bold text-primary group-hover:text-accent transition-colors"
                  >
                    詳しく見る
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
