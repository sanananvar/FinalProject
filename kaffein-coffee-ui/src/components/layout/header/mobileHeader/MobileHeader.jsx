import React, { useState } from "react";
import { navMenu } from "../../../../mocks/NavData.js";
import RightLang from "../utils/RightLang.jsx";
import SocialsBar from "../socials/SocialsBar.jsx";
import { IoMdClose } from "react-icons/io";
import { useLanguage } from "../../../../Context/LanguageContext.jsx"; // LanguageContext-i idxal edirik

const MobileHeader = ({ isMenuOpen, toggleMenu }) => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  return (
    <div className={`mobile-header ${isMenuOpen ? "open" : ""}`}>
      <div className="wrapper">
        <button className="close-button" onClick={toggleMenu}>
          <IoMdClose className="close-icon" />
        </button>
        <div className="list-wrapper">
          <RightLang toggleMenu={toggleMenu} languageId={languageId} />
          <nav className="nav-bar">
            <ul className="nav-menu">
              {navMenu(languageId).map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <SocialsBar languageId={languageId} />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;