import React from "react";

export const navMenu = (languageId) => {
  const translations = {
    1: [ // English
      { name: "Menu", href: "/menu" },
      { name: "Philosophy", href: "/about" },
      { name: "Interior", href: "/interior" },
      { name: "Location", href: "/location" } // "Location" böyük hərflə "/Location" idi, kiçik hərflə düzəltdim
    ],
    2: [ // Azerbaijani
      { name: "Menyu", href: "/menu" },
      { name: "Fəlsəfə", href: "/about" },
      { name: "İnteryer", href: "/interior" },
      { name: "Məkan", href: "/location" }
    ],
    3: [ // Russian
      { name: "Меню", href: "/menu" },
      { name: "Философия", href: "/about" },
      { name: "Интерьер", href: "/interior" },
      { name: "Местоположение", href: "/location" }
    ]
  };

  return translations[languageId] || translations[1]; // Əgər dil tapılmasa, default olaraq İngilis
};