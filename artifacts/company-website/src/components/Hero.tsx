import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0f]/90 z-10" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="AI Background"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Animated grid lines/particles feel */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Abstract Gradients */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/30 rounded-full blur-[128px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-accent/30 rounded-full blur-[128px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-accent drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="text-sm font-medium text-foreground tracking-wide">
              次世代のAIソリューションを提供
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-white glow-text">
            ビジネスの進化を、<br className="hidden md:block" />
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">AIの力で。</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            最先端の生成AI技術とデータ分析で、あなたのビジネスの可能性を最大限に引き出します。
            デジタルトランスフォーメーションの次なるステージへ。
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-base rounded-full px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all hover:-translate-y-1 font-bold border-none"
            >
              <a href="#services">
                サービスを見る
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base rounded-full px-8 h-14 glass-panel hover:bg-white/5 transition-all hover:-translate-y-1 text-white border-white/20 hover:border-white/40"
            >
              <a href="#contact">資料請求・お問い合わせ</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs text-primary font-bold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </motion.div>
    </section>
  );
}
