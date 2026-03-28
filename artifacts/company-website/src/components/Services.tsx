import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Code, LineChart, Target } from "lucide-react";

const SERVICES = [
  {
    id: "generative-ai",
    title: "生成AI導入支援",
    description: "ChatGPT等をはじめとする最新のLLMを活用し、社内業務の自動化・効率化を実現するシステムを構築します。",
    icon: Bot,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "system-dev",
    title: "AIシステム開発",
    description: "お客様の課題に合わせた独自のAIモデルの開発から、既存システムへのAI組み込みまで、一気通貫でサポートします。",
    icon: Code,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "data-analytics",
    title: "データ分析・活用",
    description: "社内に眠る膨大なデータを可視化・分析。機械学習を用いた予測モデルにより、データドリブンな意思決定を支援します。",
    icon: LineChart,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "consulting",
    title: "AI戦略コンサルティング",
    description: "AIを経営戦略にどう組み込むか。ロードマップの策定から組織のAIリテラシー向上まで、専門家が伴走します。",
    icon: Target,
    color: "bg-orange-100 text-orange-600",
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
    <section id="services" className="py-24 relative overflow-hidden bg-[#f8f9fa]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#0d0d0d]">ビジネスを加速させるAIソリューション</h3>
          <p className="text-gray-600 text-lg font-normal">
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
              <Card className="group overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${service.color}`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 text-[#0d0d0d]">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center text-sm font-bold text-[#0d0d0d] group-hover:text-blue-600 transition-colors"
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
