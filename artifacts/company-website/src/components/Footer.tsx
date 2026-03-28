import { Hexagon } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="bg-[#f8f9fa] border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 group mb-6 inline-flex">
              <Hexagon className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold tracking-tighter text-foreground">
                NEXUS AI
              </span>
            </a>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-medium">
              最先端のAI技術で、企業のデジタルトランスフォーメーションを推進し、新たな価値を創造します。
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wider">コンテンツ</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li><a href="#services" className="hover:text-primary transition-colors">サービス</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">私たちの強み</a></li>
              <li><a href="#stats" className="hover:text-primary transition-colors">実績</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wider">企業情報</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li>〒106-0032</li>
              <li>東京都港区六本木1-2-3</li>
              <li>ネクサスビル 20F</li>
              <li>info@nexus-ai.example.com</li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} NEXUS AI, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-primary transition-colors">利用規約</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
