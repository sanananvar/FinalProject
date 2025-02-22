import React from 'react';
import downArrow from "/public/downArrow.svg";
import { useLanguage } from '../../../../Context/LanguageContext'; // Context faylının yolunu öz layihənə uyğun dəyiş

const RightLang = ({ toggleMenu }) => {
    const { languageId, setLanguageId } = useLanguage(); // Context-dən dil state-ni alırıq
    const [open, setOpen] = React.useState(false);

    // Dil kodları ilə languageId-ni uyğunlaşdırmaq üçün map
    const langMap = {
        "En": 1, // English
        "Az": 2, // Azerbaijani
        "Ru": 3  // Russian
    };
    const reverseLangMap = {
        1: "En",    
        2: "Az",
        3: "Ru"
    };

    const languages = ["En", "Az", "Ru"];
    const selectedLang = reverseLangMap[languageId]; // languageId-yə uyğun string

    const handleLanguageChange = (lang) => {
        setLanguageId(langMap[lang]); // Context-dəki languageId-ni yeniləyirik
        setOpen(false);
    };

    return (
        <div className="lang-container">
            <div className="lang-select" onClick={() => setOpen(!open)}>
                <p>{selectedLang}</p>
                <img src={downArrow} alt="Arrow" className={`icon ${open ? "rotate" : ""}`} />
            </div>

            {open && (
                <ul className="dropdown">
                    <li className="selected">
                        {selectedLang} <img src={downArrow} alt="Arrow" className="up-icon" />
                    </li>
                    {languages.map((lang) =>
                        lang !== selectedLang ? (
                            <li
                                key={lang}
                                onClick={() => handleLanguageChange(lang)}
                            >
                                {lang}
                            </li>
                        ) : null
                    )}
                </ul>
            )}

            <button
                className="burger-menu"
                onClick={() => {
                    toggleMenu && toggleMenu();
                }}
            >
                <img src="/public/burger.svg" alt="" />
            </button>
        </div>
    );
};

export default RightLang;