import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext"; // LanguageContext-i idxal edirik

const Thanks = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      title: "Thanks for choosing us!",
      backLink: "Back to home page"
    },
    2: { // Azerbaijani
      title: "Bizi seçdiyiniz üçün təşəkkürlər!",
      backLink: "Ana səhifəyə qayıt"
    },
    3: { // Russian
      title: "Спасибо, что выбрали нас!",
      backLink: "Вернуться на главную страницу"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="thanks-wrapper">
      <div className="thanks">
        <img src="/public/kaffeinTextLogo.svg" alt="Kaffein Logo" />
        <h2>{t.title}</h2>
        <Link to="/">{t.backLink}</Link>
      </div>
    </div>
  );
};

export default Thanks;