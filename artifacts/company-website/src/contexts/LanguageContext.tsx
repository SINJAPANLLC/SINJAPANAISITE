import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "ja" | "en" | "zh";

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  ja: {
    // Navbar
    "nav.services": "事業概要",
    "nav.cases": "導入事例",
    "nav.news": "お知らせ",
    "nav.partners": "パートナー",
    "nav.contact": "お問い合わせ",
    "nav.about": "会社概要",
    "nav.download": "資料ダウンロード",
    // Footer
    "footer.tagline": "AIを組織に実装し、持続可能な社会を創る。",
    "footer.services": "サービス",
    "footer.company": "会社概要",
    "footer.name": "合同会社SIN JAPAN",
    "footer.founded": "2024年",
    "footer.address": "神奈川県愛甲郡愛川町中津7287",
    "footer.tel": "050-5526-9906 / 046-212-2325",
    "footer.fax": "046-212-2326",
    "footer.copy": "© {year} 合同会社SIN JAPAN. All rights reserved.",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
    "label.name": "社名",
    "label.ceo": "代表",
    "label.founded": "設立",
    "label.address": "所在地",
    "label.tel": "Tel",
    "label.fax": "Fax",
    "label.mail": "Mail",
    "label.web": "Web",
    "label.license": "許認可",
  },
  en: {
    "nav.services": "Services",
    "nav.cases": "Case Studies",
    "nav.news": "News",
    "nav.partners": "Partners",
    "nav.contact": "Contact",
    "nav.about": "About",
    "nav.download": "Download Brochure",
    "footer.tagline": "Embedding AI into organizations to create a sustainable society.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.name": "SIN JAPAN LLC",
    "footer.founded": "2024",
    "footer.address": "7287 Nakatsu, Aiko-cho, Aiko-gun, Kanagawa",
    "footer.tel": "050-5526-9906 / 046-212-2325",
    "footer.fax": "046-212-2326",
    "footer.copy": "© {year} SIN JAPAN LLC. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "label.name": "Company",
    "label.ceo": "CEO",
    "label.founded": "Founded",
    "label.address": "Address",
    "label.tel": "Tel",
    "label.fax": "Fax",
    "label.mail": "Mail",
    "label.web": "Web",
    "label.license": "License",
  },
  zh: {
    "nav.services": "业务概要",
    "nav.cases": "案例研究",
    "nav.news": "新闻",
    "nav.partners": "合作伙伴",
    "nav.contact": "联系我们",
    "nav.about": "关于我们",
    "nav.download": "下载资料",
    "footer.tagline": "将AI融入组织，创造可持续发展的社会。",
    "footer.services": "服务",
    "footer.company": "公司概要",
    "footer.name": "合同会社SIN JAPAN",
    "footer.founded": "2024年",
    "footer.address": "神奈川县爱甲郡爱川町中津7287",
    "footer.tel": "050-5526-9906 / 046-212-2325",
    "footer.fax": "046-212-2326",
    "footer.copy": "© {year} 合同会社SIN JAPAN. 保留所有权利。",
    "footer.privacy": "隐私政策",
    "footer.terms": "使用条款",
    "label.name": "公司名",
    "label.ceo": "代表",
    "label.founded": "成立",
    "label.address": "地址",
    "label.tel": "电话",
    "label.fax": "传真",
    "label.mail": "邮箱",
    "label.web": "网站",
    "label.license": "许可证",
  },
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ja",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("sj_lang");
    return (saved as Lang) || "ja";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("sj_lang", l);
  };

  const t = (key: string) => {
    const str = TRANSLATIONS[lang][key] ?? TRANSLATIONS["ja"][key] ?? key;
    return str.replace("{year}", String(new Date().getFullYear()));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
