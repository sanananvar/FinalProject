import React, { useState } from 'react';
import SocialsBar from './socials/SocialsBar';
import Mainbar from './mainHeader/Mainbar';
import MobileHeader from './mobileHeader/MobileHeader';
import { useLocation } from "react-router-dom";

const Header = () => {
  const {pathname}=useLocation()
  console.log(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={`header-wrapper ${pathname === '/' ? "absolute" : "textBlack"}`}
>
      <div className="header">
        <SocialsBar />
        <Mainbar toggleMenu={toggleMenu} />
        <MobileHeader isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>
    </header>
  );
};

export default Header;