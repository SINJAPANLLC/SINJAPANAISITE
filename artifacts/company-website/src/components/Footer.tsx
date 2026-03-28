export function Footer() {
  return (
    <footer id="about" className="bg-[#050508] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <a href="#" className="inline-flex mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-sinjapan-ai.png`}
                alt="SIN JAPAN AI"
                className="h-10 w-auto object-contain rounded"
              />
            </a>
            <p className="text-foreground/60 max-w-sm font-light leading-relaxed">
              最先端のAI技術で、企業のデジタルトランスフォーメーションを推進し、新たな価値を創造します。
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white tracking-wide">コンテンツ</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li><a href="#services" className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">サービス</a></li>
              <li><a href="#features" className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">私たちの強み</a></li>
              <li><a href="#stats" className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">実績</a></li>
              <li><a href="#contact" className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white tracking-wide">企業情報</h4>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li className="text-white/80">SIN JAPAN AI株式会社</li>
              <li><a href="https://sinjapan.work" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">sinjapan.work</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/40 font-light">
            © {new Date().getFullYear()} SIN JAPAN AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/60">
            <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-white transition-colors">利用規約</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
