import React from "react";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const CareerText = () => {
  const { languageId } = useLanguage(); // LanguageContext-dən languageId alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      title: "Apply to work with us!"
    },
    2: { // Azerbaijani
      title: "Bizimlə işləmək üçün müraciət et!"
    },
    3: { // Russian
      title: "Подай заявку на работу с нами!"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="section-desc">
      <h1>{t.title}</h1>
    </div>
  );
};

export default CareerText;