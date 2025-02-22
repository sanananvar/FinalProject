import React from "react";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik
import { useNavigate } from "react-router";

const Customer = () => {
  const navigate = useNavigate()
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      brand: "Kaffein",
      title: "Customer Survey",
      button: "Survey completed"
    },
    2: { // Azerbaijani
      brand: "Kaffein",
      title: "Müştəri Sorğusu",
      button: "Sorğu tamamlandı"
    },
    3: { // Russian
      brand: "Kaffein",
      title: "Опрос клиентов",
      button: "Опрос завершен"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <section className="customer">
      <div className="customer-img">
        <img src="/src/assets/images/siteillustration 1.svg" alt={t.title} />
      </div>
      <div className="customer-desc">
        <h5>{t.brand}</h5>
        <h2>{t.title}</h2>
        <button className="customer-btn" onClick={()=>navigate("/survey")}>{t.button}</button>
      </div>
    </section>
  );
};

export default Customer;