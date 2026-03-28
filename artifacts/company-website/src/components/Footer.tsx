export function Footer() {
  return (
    <footer id="about" className="bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 border-b border-white/10">

          {/* Logo & tagline */}
          <div className="md:col-span-5">
            <a href="#" className="inline-flex mb-6">
              <img
                src={`${import.meta.env.BASE_URL}images/logo.jpg`}
                alt="SIN JAPAN AI"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              AIを組織に実装し、<br />持続可能な社会を創る。
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-5">サービス</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">事業概要</a></li>
              <li><a href="#cases" className="hover:text-white transition-colors">導入事例</a></li>
              <li><a href="#news" className="hover:text-white transition-colors">お知らせ</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">パートナー</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">お問い合わせ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-5">会社概要</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">社名</span>
                <span>合同会社SIN JAPAN</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">設立</span>
                <span>2024年</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">所在地</span>
                <span>神奈川県愛甲郡愛川町中津7287</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">Tel</span>
                <span>050-5526-9906 / 046-212-2325</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">Fax</span>
                <span>046-212-2326</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">Mail</span>
                <span>info@sinjapan.jp</span>
              </li>
              <li className="flex gap-4">
                <span className="text-gray-600 flex-shrink-0 w-12">許認可</span>
                <span>関自貨第560号 / 14-ユ-302475</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} 合同会社SIN JAPAN. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-gray-400 transition-colors">利用規約</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
