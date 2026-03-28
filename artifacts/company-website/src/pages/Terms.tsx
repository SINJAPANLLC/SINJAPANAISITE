import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Terms of Service</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">利用規約</h1>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-10">

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第1条（適用）</h2>
              <p>
                本規約は、合同会社SIN JAPAN（以下「当社」）が提供するウェブサイトおよびサービス（以下「本サービス」）の利用に関し、
                利用者と当社との間の権利義務関係を定めることを目的とします。
                本サービスをご利用いただく場合、本規約に同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第2条（禁止事項）</h2>
              <p>利用者は、本サービスの利用にあたり以下の行為を行ってはなりません。</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>法令または公序良俗に違反する行為</li>
                <li>当社または第三者の知的財産権・肖像権・プライバシーを侵害する行為</li>
                <li>当社のサーバーまたはネットワークに過度の負荷をかける行為</li>
                <li>当社のサービス運営を妨害する行為</li>
                <li>不正アクセスまたはこれを試みる行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第3条（免責事項）</h2>
              <p>
                当社は、本サービスに掲載する情報の正確性・完全性について保証するものではありません。
                本サービスの利用により生じた損害について、当社は一切の責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第4条（知的財産権）</h2>
              <p>
                本サービスに掲載されているコンテンツ（文章・画像・デザイン等）に関する知的財産権は、
                当社または正当な権利者に帰属します。無断転載・複製・改変等を禁止します。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第5条（サービスの変更・停止）</h2>
              <p>
                当社は、利用者への事前通知なく、本サービスの内容を変更または停止することがあります。
                これにより利用者に生じた損害について、当社は責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第6条（規約の変更）</h2>
              <p>
                当社は、必要に応じて本規約を変更することがあります。
                変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">第7条（準拠法・管轄裁判所）</h2>
              <p>
                本規約は日本法に準拠し、本サービスに関して生じた紛争については、
                横浜地方裁判所を第一審の専属的合意管轄裁判所とします。
              </p>
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
