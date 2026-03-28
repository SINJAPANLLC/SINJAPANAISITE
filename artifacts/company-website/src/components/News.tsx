import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { adminNewsStore } from "@/hooks/use-admin-data";

export function News() {
  const NEWS_ITEMS = adminNewsStore.getAll();

  return (
    <section id="news" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">News</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">お知らせ</h2>
        </div>

        {/* News List */}
        <div className="flex flex-col divide-y divide-gray-200">
          {NEWS_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 py-6"
            >
              <span className="text-xs text-gray-400 font-mono flex-shrink-0 w-24">{item.date}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 border border-gray-200 px-2 py-0.5 flex-shrink-0">
                {item.category}
              </span>
              <span className="text-sm font-bold text-gray-800 flex-1">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
