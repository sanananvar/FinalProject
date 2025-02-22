import React from "react";
import { useLanguage } from "../../../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const Copyright = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      text: "© 2024 All rights reserved"
    },
    2: { // Azerbaijani
      text: "© 2024 Bütün hüquqlar qorunur"
    },
    3: { // Russian
      text: "© 2024 Все права защищены"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="copyright">
      <p>{t.text}</p>
    </div>
  );
};

export default Copyright;