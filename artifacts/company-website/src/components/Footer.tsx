export function Footer() {
  return (
    <footer id="about" className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <a href="#" className="inline-flex mb-6">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-sinjapan-live.png`}
                alt="SIN JAPAN AI LIVE"
                className="h-10 w-auto object-contain rounded"
              />
            </a>
            <p className="text-muted-foreground max-w-sm">
              最先端のAI技術で、企業のデジタルトランスフォーメーションを推進し、新たな価値を創造します。
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">コンテンツ</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">サービス</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">私たちの強み</a></li>
              <li><a href="#stats" className="hover:text-primary transition-colors">実績</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">企業情報</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>SIN JAPAN AI株式会社</li>
              <li><a href="https://sinjapan.work" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">sinjapan.work</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SIN JAPAN AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-primary transition-colors">利用規約</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
