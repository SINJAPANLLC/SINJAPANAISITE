import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white pt-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content (60%) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left pt-12 lg:pt-0"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-[#0d0d0d]">
              AIで、ビジネスを<br />
              次のステージへ
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl font-medium tracking-wide">
              SIN JAPAN AI — Generative AI Solutions
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-base rounded-full px-8 h-14 bg-[#0d0d0d] text-white hover:bg-black/80 transition-all hover:-translate-y-0.5 font-bold"
              >
                <a href="#services">
                  サービスを見る
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base rounded-full px-8 h-14 bg-transparent border-gray-300 text-[#0d0d0d] hover:bg-gray-50 transition-all hover:-translate-y-0.5 font-bold"
              >
                <a href="#contact">まずは相談する</a>
              </Button>
            </div>
          </motion.div>

          {/* Right Visual (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center h-[400px] lg:h-[600px] w-full"
          >
            {/* Colorful Abstract Swirl Decorative Element behind logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full h-full max-w-[500px] max-h-[500px] animate-spin-slow">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute inset-0 mix-blend-multiply opacity-80" style={{ transform: 'rotate(0deg)' }}>
                  <path fill="url(#grad1)" d="M45,-78.2C58.8,-70.5,70.9,-58,80.7,-43.3C90.5,-28.6,98,-11.7,95.5,3.7C93,19.2,80.4,33.1,68.5,45.2C56.6,57.3,45.3,67.6,31.7,73.6C18.1,79.5,2.1,81.1,-12.3,77.7C-26.7,74.3,-39.5,65.8,-50.7,55C-61.9,44.2,-71.4,31,-76.8,15.7C-82.2,0.5,-83.4,-16.9,-77.3,-31.6C-71.2,-46.3,-57.8,-58.3,-43.2,-65.7C-28.7,-73.1,-14.3,-76,-0.1,-75.8C14.1,-75.6,28.2,-72.3,45,-78.2Z" transform="translate(100 100)" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#e53e3e', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#9f7aea', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#4299e1', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute inset-0 mix-blend-multiply opacity-60" style={{ transform: 'rotate(60deg) scale(0.9)' }}>
                  <path fill="url(#grad2)" d="M52.3,-71.4C66.8,-60.7,77,-43.9,81.4,-26.2C85.7,-8.4,84.1,10.3,75.4,25.6C66.8,40.8,51.1,52.5,34.8,61.9C18.5,71.3,1.7,78.3,-14.2,76.2C-30.1,74.1,-45.2,62.8,-56.3,48.9C-67.4,35.1,-74.6,18.8,-75.8,2.1C-77,-14.7,-72.2,-31.8,-61.7,-44.6C-51.2,-57.3,-35,-65.8,-19.4,-70.7C-3.8,-75.6,11.2,-76.9,26.7,-74C42.2,-71.1,57.7,-62.1,52.3,-71.4Z" transform="translate(100 100)" />
                  <defs>
                    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ed64a6', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#38b2ac', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute inset-0 mix-blend-multiply opacity-70" style={{ transform: 'rotate(120deg) scale(1.1)' }}>
                  <path fill="url(#grad3)" d="M37.3,-62.3C49.9,-56.2,63.1,-49,70.5,-37.8C78,-26.5,79.7,-11.2,77.5,3.4C75.3,18,69.2,31.9,60.1,43.4C50.9,54.8,38.6,63.7,24.6,69.5C10.5,75.3,-5.4,78.1,-21.1,75.1C-36.8,72,-52.3,63.1,-63.3,50C-74.3,37,-80.7,19.8,-80.6,3.4C-80.5,-12.9,-73.9,-28.4,-63.3,-40.4C-52.6,-52.4,-37.9,-61,-23.7,-65.7C-9.5,-70.3,3.3,-71,15.6,-68.8C28,-66.5,41,-61.2,37.3,-62.3Z" transform="translate(100 100)" />
                  <defs>
                    <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#3182ce', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#805ad5', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#e53e3e', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Logo Image */}
            <div className="relative z-10 w-full max-w-sm drop-shadow-2xl">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-sinjapan-ai.png`}
                alt="SIN JAPAN AI Logo"
                className="w-full h-auto object-contain bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
