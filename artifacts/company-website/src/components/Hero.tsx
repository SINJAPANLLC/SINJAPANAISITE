import { motion } from "framer-motion";
import { Download, Mail, Medal, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-16 bg-[#f8f9fa] min-h-screen flex flex-col justify-center overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center flex-1">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl flex flex-col gap-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-foreground">
              <span className="whitespace-nowrap">AIを組織に実装し、</span><br />
              <span className="whitespace-nowrap">持続可能な社会を創る</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-black pl-4">
              SIN JAPAN AIは、AIコンサルティング、AIシステム開発まで、企業のAI実装を一気通貫で伴走支援します。
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

          {/* Right Column - Abstract Art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative w-full aspect-square max-w-[700px] mx-auto lg:ml-auto"
          >
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fiber1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a56db" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <linearGradient id="fiber2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e02424" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  <linearGradient id="fiber3" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="fiber4" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="fiber5" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#1a56db" />
                  </linearGradient>
                  <linearGradient id="fiber6" x1="80%" y1="100%" x2="20%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#e02424" />
                  </linearGradient>
                </defs>

                <g transform="translate(250 250) rotate(0)">
                  <path d="M -180 -80 C -80 -200 180 -80 180 80 C 80 200 -180 80 -180 -80" fill="none" stroke="url(#fiber1)" strokeWidth="8" opacity="0.6" />
                  <path d="M -120 -120 C 0 -220 180 -120 120 80 C 80 250 -180 120 -120 -120" fill="none" stroke="url(#fiber2)" strokeWidth="12" opacity="0.5" />
                  <path d="M -220 0 C -120 -220 120 -220 220 0 C 120 220 -120 220 -220 0" fill="none" stroke="url(#fiber3)" strokeWidth="6" opacity="0.7" />
                  <path d="M -80 -180 C 180 -180 250 0 80 180 C -120 350 -300 80 -80 -180" fill="none" stroke="url(#fiber4)" strokeWidth="10" opacity="0.4" />
                  <path d="M -150 -100 C 80 -250 220 0 100 150 C -80 300 -300 80 -150 -100" fill="none" stroke="url(#fiber5)" strokeWidth="4" opacity="0.6" />
                  <path d="M -100 -150 Q 180 -180 150 100 T -100 -150" fill="none" stroke="url(#fiber6)" strokeWidth="2" opacity="0.8" />
                  <path d="M -50 -200 C 100 -200 200 -50 50 200 C -100 200 -200 50 -50 -200" fill="none" stroke="url(#fiber1)" strokeWidth="1" opacity="0.9" />
                  <path d="M -200 -50 C -200 100 -50 200 200 50 C 200 -100 50 -200 -200 -50" fill="none" stroke="url(#fiber3)" strokeWidth="3" opacity="0.7" />
                </g>
              </svg>
            </div>
            
          </motion.div>

        </div>

        {/* Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 md:mt-24 pb-8"
        >
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Badge 1 */}
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded border border-gray-100 shadow-sm">
              <div className="w-8 h-8 bg-yellow-50 flex items-center justify-center">
                <Medal className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-500">SIN JAPAN AI AGENT</p>
                <p className="text-xs font-black text-gray-900">業界主要アワード W受賞!</p>
              </div>
            </div>
            
            {/* Badge 2 */}
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded border border-gray-100 shadow-sm">
              <div className="w-8 h-8 bg-red-50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-red-600">AI PRODUCTS NEXT AI TREND 2026</p>
                <p className="text-xs font-black text-gray-900">AIエージェント部門</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded border border-gray-100 shadow-sm">
              <div className="w-8 h-8 bg-blue-50 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-blue-600">ITreview Grid Award 2026 Winter</p>
                <p className="text-xs font-black text-gray-900">Leader AIエージェント部門</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
