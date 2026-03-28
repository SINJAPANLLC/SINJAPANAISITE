import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 z-10" />
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="AI Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Abstract Gradients */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/80">
              次世代のAIソリューションを提供
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            ビジネスの進化を、<br className="hidden md:block" />
            <span className="text-gradient">AIの力で。</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            最先端の生成AI技術とデータ分析で、あなたのビジネスの可能性を最大限に引き出します。
            デジタルトランスフォーメーションの次なるステージへ。
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-base rounded-full px-8 h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
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
              className="w-full sm:w-auto text-base rounded-full px-8 h-14 glass-panel hover:bg-muted/50 transition-all hover:-translate-y-1"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
