import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-16 bg-[#f8f9fa] min-h-screen flex flex-col justify-center overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="flex items-center flex-1">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl flex flex-col gap-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-foreground">
              <span className="whitespace-nowrap">AIを組織に実装し</span><br />
              <span className="whitespace-nowrap">持続可能な社会を創る</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-black pl-4">
              SIN JAPAN AIは、AIコンサルティング、AIシステム開発まで<br />
              企業のAI実装を一気通貫で伴走支援します。
            </p>

            <div className="flex flex-col gap-4 w-full max-w-md pt-4">
              <Button
                asChild
                size="lg"
                className="w-full text-base rounded-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] font-medium tracking-wider"
              >
                <a href="#download" className="flex items-center justify-center gap-2">
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
              <div className="flex items-center gap-3">
                {/* Laurel Left */}
                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 44 C8 36 4 26 6 16 C8 8 12 4 16 4" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
                  <ellipse cx="8" cy="12" rx="5" ry="3" transform="rotate(-30 8 12)" fill="#C9A84C" opacity="0.8"/>
                  <ellipse cx="6" cy="20" rx="5" ry="3" transform="rotate(-20 6 20)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="6" cy="28" rx="5" ry="3" transform="rotate(-10 6 28)" fill="#C9A84C" opacity="0.9"/>
                  <ellipse cx="8" cy="36" rx="5" ry="3" transform="rotate(5 8 36)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="12" cy="42" rx="5" ry="3" transform="rotate(20 12 42)" fill="#C9A84C" opacity="0.8"/>
                </svg>
                <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: 1, color: '#111827' }}>500</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, color: '#111827', marginBottom: '3px' }}>社以上</span>
                </div>
                {/* Laurel Right */}
                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'scaleX(-1)'}}>
                  <path d="M16 44 C8 36 4 26 6 16 C8 8 12 4 16 4" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
                  <ellipse cx="8" cy="12" rx="5" ry="3" transform="rotate(-30 8 12)" fill="#C9A84C" opacity="0.8"/>
                  <ellipse cx="6" cy="20" rx="5" ry="3" transform="rotate(-20 6 20)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="6" cy="28" rx="5" ry="3" transform="rotate(-10 6 28)" fill="#C9A84C" opacity="0.9"/>
                  <ellipse cx="8" cy="36" rx="5" ry="3" transform="rotate(5 8 36)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="12" cy="42" rx="5" ry="3" transform="rotate(20 12 42)" fill="#C9A84C" opacity="0.8"/>
                </svg>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">※2026年2月時点</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-20 bg-gray-200" />

            {/* Stat 2 */}
            <div className="md:flex-1 flex flex-col items-center gap-1 md:px-10">
              <p className="text-xs text-gray-500 font-medium tracking-wide">利用企業満足度 *</p>
              <div className="flex items-center gap-3">
                {/* Laurel Left */}
                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 44 C8 36 4 26 6 16 C8 8 12 4 16 4" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
                  <ellipse cx="8" cy="12" rx="5" ry="3" transform="rotate(-30 8 12)" fill="#C9A84C" opacity="0.8"/>
                  <ellipse cx="6" cy="20" rx="5" ry="3" transform="rotate(-20 6 20)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="6" cy="28" rx="5" ry="3" transform="rotate(-10 6 28)" fill="#C9A84C" opacity="0.9"/>
                  <ellipse cx="8" cy="36" rx="5" ry="3" transform="rotate(5 8 36)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="12" cy="42" rx="5" ry="3" transform="rotate(20 12 42)" fill="#C9A84C" opacity="0.8"/>
                </svg>
                <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontSize: '3.75rem', fontWeight: 900, lineHeight: 1, color: '#111827' }}>100</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, color: '#111827', marginBottom: '3px' }}>%</span>
                </div>
                {/* Laurel Right */}
                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'scaleX(-1)'}}>
                  <path d="M16 44 C8 36 4 26 6 16 C8 8 12 4 16 4" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
                  <ellipse cx="8" cy="12" rx="5" ry="3" transform="rotate(-30 8 12)" fill="#C9A84C" opacity="0.8"/>
                  <ellipse cx="6" cy="20" rx="5" ry="3" transform="rotate(-20 6 20)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="6" cy="28" rx="5" ry="3" transform="rotate(-10 6 28)" fill="#C9A84C" opacity="0.9"/>
                  <ellipse cx="8" cy="36" rx="5" ry="3" transform="rotate(5 8 36)" fill="#C9A84C" opacity="0.85"/>
                  <ellipse cx="12" cy="42" rx="5" ry="3" transform="rotate(20 12 42)" fill="#C9A84C" opacity="0.8"/>
                </svg>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">利用企業へのアンケート調査より</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
