import React from "react";
import { footerNav } from "../../../../mocks/FooterNavData.js"; // Funksiya idxal edilir
import { useLanguage } from "../../../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const FooterNav = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  return (
    <div className="footer-nav">
      <div className="footer-nav-list">
        {footerNav(languageId).map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;