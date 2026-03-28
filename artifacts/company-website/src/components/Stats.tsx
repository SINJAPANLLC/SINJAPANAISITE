import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target: number, duration: number = 1600) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

const STATS = [
  { target: 500, suffix: "社", label: "導入実績企業数", note: "※2026年2月時点", noComma: false },
  { target: 100, suffix: "%", label: "顧客満足度", note: "※社内アンケート調査より", noComma: false },
  { target: 2024, suffix: "年", label: "設立", note: "※SIN JAPAN AI 創業", noComma: true },
];

function StatItem({ target, suffix, label, note, delay, noComma }: {
  target: number; suffix: string; label: string; note: string; delay: number; noComma: boolean;
}) {
  const { count, ref } = useCountUp(target, 1400 + delay * 200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center px-4 py-8"
    >
      <div className="flex items-baseline mb-3 gap-1">
        <span className="text-5xl md:text-6xl font-black tracking-tighter text-gray-800 tabular-nums">
          {noComma ? count.toString() : count.toLocaleString()}
        </span>
        <span className="text-2xl font-bold text-gray-400">{suffix}</span>
      </div>
      <span className="text-sm font-bold text-gray-500 tracking-wider mb-1">{label}</span>
      <span className="text-[10px] text-gray-400">{note}</span>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section id="stats" className="py-24 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-300">
          {STATS.map((stat, i) => (
            <StatItem key={i} {...stat} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
