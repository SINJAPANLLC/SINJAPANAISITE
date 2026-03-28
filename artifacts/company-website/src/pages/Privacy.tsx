import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Privacy Policy</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">プライバシーポリシー</h1>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-10">

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">1. 基本方針</h2>
              <p>
                合同会社SIN JAPAN（以下「当社」）は、お客様の個人情報の保護を重要な社会的責務と認識し、
                個人情報の保護に関する法律（個人情報保護法）をはじめとする関係法令を遵守し、
                お客様の個人情報を適切に取り扱います。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">2. 取得する情報</h2>
              <p>当社は、以下の個人情報を取得することがあります。</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>氏名・会社名</li>
                <li>メールアドレス・電話番号</li>
                <li>お問い合わせ内容</li>
                <li>当サイトの閲覧履歴・利用状況（Cookieを含む）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">3. 利用目的</h2>
              <p>取得した個人情報は、以下の目的で利用します。</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>お問い合わせへの回答・対応</li>
                <li>サービスに関するご案内・情報提供</li>
                <li>サービスの改善・新機能の開発</li>
                <li>アクセス解析による当サイトの改善</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">4. 第三者への提供</h2>
              <p>
                当社は、法令に定める場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">5. Cookieについて</h2>
              <p>
                当サイトでは、サービス向上およびアクセス解析を目的としてCookieを使用しています。
                ブラウザの設定によりCookieを無効にすることができますが、その場合、一部のサービスが正常に動作しない場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">6. 安全管理措置</h2>
              <p>
                当社は、個人情報の漏洩・滅失・毀損を防ぐため、適切な安全管理措置を講じます。
                また、個人情報を取り扱う従業者に対し、必要な監督を行います。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">7. 開示・訂正・削除</h2>
              <p>
                お客様は、当社が保有する個人情報の開示・訂正・削除を請求することができます。
                ご請求の際は、下記の問い合わせ窓口までご連絡ください。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">8. お問い合わせ窓口</h2>
              <div className="bg-gray-50 border border-gray-100 p-6 space-y-2 text-sm">
                <p><span className="font-bold text-gray-700">合同会社SIN JAPAN</span></p>
                <p>〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
                <p>Mail：info@sinjapan.jp</p>
                <p>Tel：050-5526-9906 / 046-212-2325</p>
              </div>
            </section>

            <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
              制定日：2024年1月1日
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
