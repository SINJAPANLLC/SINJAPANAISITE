import { motion } from "framer-motion";

const STATS = [
  { value: "200", suffix: "+", label: "導入実績企業" },
  { value: "500", suffix: "+", label: "プロジェクト数" },
  { value: "98", suffix: "%", label: "顧客満足度" },
  { value: "2018", suffix: "年", label: "設立" }
];

export function Stats() {
  return (
    <section id="stats" className="py-24 relative overflow-hidden bg-[#0a0a0f] border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50" />
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center text-center p-6 glass-panel rounded-2xl hover:bg-white/[0.03] transition-colors border border-white/5 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
            >
              <div className="flex items-baseline mb-2 text-gradient drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <span className="text-4xl md:text-6xl font-black tracking-tighter">{stat.value}</span>
                <span className="text-xl md:text-2xl font-bold ml-1 text-primary">{stat.suffix}</span>
              </div>
              <span className="text-sm md:text-base font-medium text-foreground/70 tracking-wide">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
