import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Hexagon, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAIN_NAV_LINKS = [
  { label: "NEXUS AIとは", href: "#about" },
  { label: "サービス", href: "#services", hasDropdown: true },
  { label: "導入事例", href: "#stats" },
  { label: "お役立ち情報", href: "#features", hasDropdown: true },
  { label: "セミナー", href: "#seminar" },
  { label: "ニュース", href: "#news" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border transition-all duration-300">
      {/* Top Row */}
      <div className="border-b border-border hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-8 text-xs text-muted-foreground gap-6">
            <a href="#" className="hover:text-foreground transition-colors">会社概要</a>
            <a href="#" className="hover:text-foreground transition-colors">パートナープログラム</a>
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
              ログイン <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="bg-destructive text-destructive-foreground px-3 py-1 font-medium hover:bg-destructive/90 transition-colors">
              採用情報
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group flex-shrink-0">
            <Hexagon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tighter">
              NEXUS AI
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <ul className="flex items-center gap-8">
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-bold text-foreground hover:text-accent transition-colors flex items-center gap-1"
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
            <Button asChild className="rounded-none px-6 h-12 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="#contact">製品紹介資料</a>
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
                  className="text-base font-bold py-2 border-b border-border text-foreground hover:text-accent flex items-center justify-between"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <a href="#" className="text-sm py-2 hover:text-accent">会社概要</a>
                <a href="#" className="text-sm py-2 hover:text-accent">パートナープログラム</a>
                <a href="#" className="text-sm py-2 hover:text-accent flex items-center gap-1">ログイン <ExternalLink className="w-3 h-3" /></a>
                <a href="#" className="text-sm py-2 text-destructive font-bold">採用情報</a>
              </div>
              <Button asChild className="mt-2 w-full rounded-none h-12 bg-primary">
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                  製品紹介資料
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
