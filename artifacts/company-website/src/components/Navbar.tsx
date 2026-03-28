import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAIN_NAV_LINKS = [
  { label: "事業概要", href: "#services" },
  { label: "導入事例", href: "#cases" },
  { label: "お知らせ", href: "#news" },
  { label: "パートナー", href: "#partners" },
  { label: "お問い合わせ", href: "#contact" },
  { label: "会社概要", href: "#about" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-all duration-300">
      {/* Top Row */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-8 text-[11px] text-muted-foreground gap-8">
            <a href="/admin" className="hover:text-foreground transition-colors flex items-center gap-1">
              ログイン <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.jpg`}
              alt="SIN JAPAN AI"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center flex-1 justify-end mr-6">
            <ul className="flex items-center gap-8">
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-foreground hover:text-accent transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Button asChild className="rounded-none px-6 h-12 text-sm font-medium tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="#download">資料ダウンロード</a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
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
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {MAIN_NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium py-2 border-b border-border text-foreground hover:text-accent flex items-center justify-between"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <a href="#" className="text-sm py-2 hover:text-accent flex items-center gap-1">ログイン <ExternalLink className="w-3 h-3" /></a>
              </div>
              <Button asChild className="mt-2 w-full rounded-none h-12 tracking-wide font-medium bg-primary">
                <a href="#download" onClick={() => setIsMobileMenuOpen(false)}>
                  資料ダウンロード
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
