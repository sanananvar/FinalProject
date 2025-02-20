import React, { useState } from "react";
import { navMenu } from "../../../../mocks/NavData.js";
import RightLang from "../utils/RightLang.jsx";
import SocialsBar from "../socials/SocialsBar.jsx";
import { IoMdClose } from "react-icons/io";

const MobileHeader = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className={`mobile-header ${isMenuOpen ? "open" : ""}`}>
      <div className="wrapper">
        <button className="close-button" onClick={toggleMenu}>
          <IoMdClose className="close-icon" />
        </button>
        <div className="list-wrapper">
          <RightLang toggleMenu={toggleMenu} />
          <nav className="nav-bar">
            <ul className="nav-menu">
              {navMenu.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <SocialsBar />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;