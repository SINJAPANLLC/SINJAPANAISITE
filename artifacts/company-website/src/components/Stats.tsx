import { motion } from "framer-motion";

const STATS = [
  { value: "200", suffix: "+", label: "導入実績企業" },
  { value: "500", suffix: "+", label: "プロジェクト数" },
  { value: "98", suffix: "%", label: "顧客満足度" },
  { value: "2018", suffix: "年", label: "設立" }
];

export function Stats() {
  return (
    <section id="stats" className="py-24 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 divide-x divide-transparent md:divide-white/10">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="flex items-baseline mb-3">
                <span className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {stat.value}
                </span>
                <span className="text-2xl font-bold ml-1 text-gray-400">{stat.suffix}</span>
              </div>
              <span className="text-sm font-bold text-gray-400 tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
