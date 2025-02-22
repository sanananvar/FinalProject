export const footerNav = (languageId) => {
  const translations = {
    1: [ // English
      { name: "Contact", href: "/" },
      { name: "Location", href: "/" },
      { name: "Career", href: "/career" }
    ],
    2: [ // Azerbaijani
      { name: "Əlaqə", href: "/" },
      { name: "Məkan", href: "/" },
      { name: "Karyera", href: "/career" }
    ],
    3: [ // Russian
      { name: "Контакты", href: "/" },
      { name: "Местоположение", href: "/" },
      { name: "Карьера", href: "/career" }
    ]
  };

  return translations[languageId] || translations[1]; // Əgər dil tapılmasa, default olaraq İngilis
};