import React from "react";
import InteriorText from "../components/interior/InteriorText";
import InteriorTabs from "../components/interior/InteriorTabs";
import { Link } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";

const Interior = () => {
  const { languageId } = useLanguage();

  const translations = {
    1: {
      home: "Home",
      interior: "Interior",
    },
    2: {
      home: "Ana Səhifə",
      interior: "İnteryer",
    },
    3: {
      home: "Главная",
      interior: "Интерьер",
    },
  };

  const t = translations[languageId];

  return (
    <div className="interior-wrapper">
      <div className="interior">
        <div className="breakpoints">
          <Link to="/" className="break-link">
            {t.home}{" "}
          </Link>
          <span> /</span>
          <Link to="/interior">{t.interior}</Link>
        </div>
        <InteriorText languageId={languageId} />
        <InteriorTabs languageId={languageId} />
      </div>
    </div>
  );
};

export default Interior;