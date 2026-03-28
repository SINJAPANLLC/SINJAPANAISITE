import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
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

export function Hero() {
  const stat1 = useCountUp(500, 1800);
  const stat2 = useCountUp(100, 1400);

  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-16 bg-[#f8f9fa] min-h-screen flex flex-col justify-center">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="flex items-center flex-1">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl flex flex-col gap-6 sm:gap-8"
          >
            <h1 className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-foreground">
              AIを組織に実装し<br />
              持続可能な社会を創る
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-black pl-4">
              SIN JAPAN AIは、AIコンサルティング、AIシステム開発まで、企業のAI実装を一気通貫で伴走支援します。
            </p>

            <div className="flex flex-col gap-4 w-full max-w-md pt-2 sm:pt-4">
              <Button
                asChild
                size="lg"
                className="w-full text-base rounded-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] font-medium tracking-wider"
              >
                <a href="/download" className="flex items-center justify-center gap-2">
                  資料ダウンロードする <Download className="w-5 h-5 ml-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full text-base rounded-full h-14 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm font-medium tracking-wider"
              >
                <a href="#contact" className="flex items-center justify-center gap-2">
                  まずは相談する <Mail className="w-5 h-5 ml-1" />
                </a>
              </Button>
            </div>
          </motion.div>

        </div>

        {/* Stats Bar */}
        <motion.div
          ref={stat1.ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="border-t border-gray-200 mt-16 pt-10 pb-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-0">
            {/* Left Text */}
            <div className="md:w-1/3 md:pr-12">
              <p className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
                業種・規模を問わず、<br />全国の法人が導入中
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-20 bg-gray-200" />

            {/* Stat 1 */}
            <div className="md:flex-1 flex flex-col items-center gap-1 md:px-10">
              <p className="text-xs text-gray-500 font-medium tracking-wide">導入企業数 *</p>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: 1, color: '#111827', display: 'block' }}>
                  {stat1.count}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', position: 'absolute', left: '100%', bottom: 0, whiteSpace: 'nowrap', paddingLeft: '3px' }}>社以上</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">※2026年2月時点</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-20 bg-gray-200" />

            {/* Stat 2 */}
            <div ref={stat2.ref as React.RefObject<HTMLDivElement>} className="md:flex-1 flex flex-col items-center gap-1 md:px-10">
              <p className="text-xs text-gray-500 font-medium tracking-wide">利用企業満足度 *</p>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: 1, color: '#111827', display: 'block' }}>
                  {stat2.count}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', position: 'absolute', left: '100%', bottom: 0, whiteSpace: 'nowrap', paddingLeft: '3px' }}>%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">利用企業へのアンケート調査より</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
