import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Microsoft", category: "テクノロジー" },
  { name: "Google Cloud", category: "クラウド" },
  { name: "AWS", category: "クラウド" },
  { name: "Salesforce", category: "CRM" },
  { name: "OpenAI", category: "AI" },
  { name: "Anthropic", category: "AI" },
];

export function Partners() {
  return (
    <section id="partners" className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Partners</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">パートナー</h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-100">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="bg-white flex flex-col items-center justify-center gap-2 py-12 px-8 group hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-xl font-black text-gray-700 group-hover:text-gray-900 transition-colors tracking-tight">
                {partner.name}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {partner.category}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          ※ パートナープログラムに参加いただいている企業の一部を掲載しています
        </p>

      </div>
    </section>
  );
}
