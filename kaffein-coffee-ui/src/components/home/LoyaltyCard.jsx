import React from "react";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const LoyaltyCard = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      title: "Loyalty Card",
      description: "on your smartphone"
    },
    2: { // Azerbaijani
      title: "Sadiqlik Kartı",
      description: "smartfonunuzda"
    },
    3: { // Russian
      title: "Карта лояльности",
      description: "на вашем смартфоне"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <section className="loyalty-card">
      <div className="text">
        <h3>{t.title}</h3>
        <p>{t.description}</p>
      </div>
      <div className="section-image">
        <img src="/src/assets/images/Loyalty card phone 1.svg" alt={t.title} />
      </div>
    </section>
  );
};

export default LoyaltyCard;