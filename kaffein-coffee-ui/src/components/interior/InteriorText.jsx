import React from "react";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const InteriorText = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      title: "Join us at Kaffein in the early morning, where coffee comes first, even before saying good morning."
    },
    2: { // Azerbaijani
      title: "Səhər erkən Kaffein-də bizə qoşulun, burada qəhvə hər şeydən əvvəl gəlir, hətta 'sabahınız xeyir' deməkdən də əvvəl."
    },
    3: { // Russian
      title: "Присоединяйтесь к нам в Kaffein ранним утром, где кофе на первом месте, даже раньше, чем сказать 'доброе утро'."
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="section-desc">
      <h1>{t.title}</h1>
    </div>
  );
};

export default InteriorText;