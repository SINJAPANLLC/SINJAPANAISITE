import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "サービス", href: "#services" },
  { label: "強み", href: "#features" },
  { label: "実績", href: "#stats" },
  { label: "会社概要", href: "#about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm" : "bg-white py-5 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <img
              src={`${import.meta.env.BASE_URL}images/logo-sinjapan-ai.png`}
              alt="SIN JAPAN AI"
              className="h-10 w-auto object-contain rounded"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button asChild className="rounded-full px-6 bg-black text-white hover:bg-gray-800 transition-all">
              <a href="#contact">お問い合わせ</a>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium py-3 px-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 pb-2 px-2">
                <Button asChild className="w-full rounded-full bg-black text-white hover:bg-gray-800 transition-all py-6">
                  <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                    お問い合わせ
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
