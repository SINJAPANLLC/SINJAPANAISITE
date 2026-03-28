import { motion } from "framer-motion";
import { Download, Mail, Medal, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-16 bg-[#f8f9fa] min-h-screen flex flex-col justify-center overflow-hidden">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center flex-1">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.2] tracking-tight text-foreground">
              AIを組織に実装し、<br />持続可能な社会を創る
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 font-medium leading-relaxed">
              SIN JAPAN AIは、AIコンサルティング、AIシステム開発まで、企業のAI実装を一気通貫で伴走支援します。
            </p>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button
                asChild
                size="lg"
                className="w-full text-base rounded-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <a href="#download" className="flex items-center justify-center gap-2">
                  資料ダウンロードする <Download className="w-5 h-5 ml-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full text-base rounded-full h-14 bg-white border-2 border-primary text-primary hover:bg-muted transition-all hover:scale-[1.02]"
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
            className="relative w-full aspect-square max-w-[600px] mx-auto lg:ml-auto"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fiber1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4169E1" />
                    <stop offset="100%" stopColor="#9370DB" />
                  </linearGradient>
                  <linearGradient id="fiber2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#DC143C" />
                    <stop offset="100%" stopColor="#FF69B4" />
                  </linearGradient>
                  <linearGradient id="fiber3" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#9370DB" />
                    <stop offset="100%" stopColor="#00CED1" />
                  </linearGradient>
                  <linearGradient id="fiber4" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#FF69B4" />
                    <stop offset="100%" stopColor="#4169E1" />
                  </linearGradient>
                </defs>

                <g transform="translate(200 200) rotate(0)">
                  <path d="M -150 -50 C -50 -150 150 -50 150 50 C 50 150 -150 50 -150 -50" fill="none" stroke="url(#fiber1)" strokeWidth="6" opacity="0.6" />
                  <path d="M -100 -100 C 0 -180 150 -100 100 50 C 50 200 -150 100 -100 -100" fill="none" stroke="url(#fiber2)" strokeWidth="8" opacity="0.5" />
                  <path d="M -180 0 C -100 -180 100 -180 180 0 C 100 180 -100 180 -180 0" fill="none" stroke="url(#fiber3)" strokeWidth="4" opacity="0.7" />
                  <path d="M -50 -150 C 150 -150 200 0 50 150 C -100 300 -250 50 -50 -150" fill="none" stroke="url(#fiber4)" strokeWidth="10" opacity="0.4" />
                  <path d="M -120 -80 C 50 -200 180 0 80 120 C -50 250 -250 50 -120 -80" fill="none" stroke="url(#fiber1)" strokeWidth="5" opacity="0.6" />
                  <path d="M -80 -120 Q 150 -150 120 80 T -80 -120" fill="none" stroke="url(#fiber2)" strokeWidth="3" opacity="0.8" />
                </g>
              </svg>
            </div>
            
            {/* Center Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-32 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center border border-border px-4">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo.jpg`}
                  alt="SIN JAPAN AI"
                  className="w-full h-auto object-contain"
                />
              </div>
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
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-8">
            {/* Badge 1 */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-muted-foreground">SIN JAPAN AI AGENT</p>
                <p className="text-sm font-black text-foreground">業界主要アワード W受賞!</p>
              </div>
            </div>
            
            {/* Badge 2 */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-red-100 shadow-sm">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-red-600">AI PRODUCTS NEXT AI TREND 2026</p>
                <p className="text-sm font-black text-foreground">AIエージェント部門</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-blue-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-blue-600">ITreview Grid Award 2026 Winter</p>
                <p className="text-sm font-black text-foreground">Leader AIエージェント部門</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
