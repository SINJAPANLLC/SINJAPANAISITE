import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const COOKIE_KEY = "sin_japan_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-950 border-t border-white/10"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 pr-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                当サイトでは、サービス向上およびアクセス解析のためにCookieを使用しています。
                「同意する」をクリックすることで、Cookieの使用に同意したものとみなします。
                詳しくは
                <a href="/privacy" className="underline text-gray-100 hover:text-white mx-1">プライバシーポリシー</a>
                をご確認ください。
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 border border-white/10 hover:border-white/30"
              >
                拒否する
              </button>
              <button
                onClick={accept}
                className="text-xs font-bold bg-white text-gray-900 hover:bg-gray-100 transition-colors px-5 py-2"
              >
                同意する
              </button>
              <button onClick={decline} className="text-gray-500 hover:text-white transition-colors ml-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
