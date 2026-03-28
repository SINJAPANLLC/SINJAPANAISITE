import { motion } from "framer-motion";

const STATS = [
  { value: "200", suffix: "+", label: "導入実績企業" },
  { value: "500", suffix: "+", label: "プロジェクト数" },
  { value: "98", suffix: "%", label: "顧客満足度" },
  { value: "2018", suffix: "年", label: "設立" }
];

export function Stats() {
  return (
    <section id="stats" className="py-20 bg-white border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center justify-center text-center p-6 bg-[#f8f9fa] rounded-2xl border border-border"
            >
              <div className="flex items-baseline mb-2 text-primary">
                <span className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</span>
                <span className="text-xl font-bold ml-1">{stat.suffix}</span>
              </div>
              <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
