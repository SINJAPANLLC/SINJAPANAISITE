import { motion } from "framer-motion";
import { Download, Mail, Medal, Trophy } from "lucide-react";
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
