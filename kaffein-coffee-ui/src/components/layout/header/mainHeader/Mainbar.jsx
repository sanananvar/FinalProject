import React, { useState, useEffect } from "react";
import LeftLogo from "../utils/LeftLogo";
import RightLang from "../utils/RightLang.jsx";
import { navMenu } from "../../../../mocks/NavData.js"; // Funksiya idxal edilir
import scrolledLogo from "../../../../../public/kaffeinTextLogo.svg";
import { useLanguage } from '../../../../Context/LanguageContext.jsx'; // Context-dən istifadə

const Mainbar = ({ toggleMenu }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [navWidth, setNavWidth] = useState("100%");
    const { languageId } = useLanguage(); // Seçilmiş dili alırıq

    useEffect(() => {
        const updateNavWidth = () => {
            const header = document.querySelector(".header");
            if (header) {
                setNavWidth(`${header.offsetWidth}px`);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 130) {
                setIsScrolled(true);
                updateNavWidth();
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", updateNavWidth);

        updateNavWidth();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateNavWidth);
        };
    }, []);

    return (
        <div
            className={`main-bar ${isScrolled ? "scrolled" : ""}`}
            style={isScrolled ? { width: navWidth } : {}}
        >
            {isScrolled ? (
                <img src={scrolledLogo} alt="Scrolled Logo" className="scr-logo" />
            ) : (
                <LeftLogo />
            )}

            <nav className="nav-bar">
                <ul className="nav-menu">
                    {navMenu(languageId).map((item, index) => (
                        <li key={index}>
                            <a href={item.href}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>

            <RightLang toggleMenu={toggleMenu} languageId={languageId} />
        </div>
    );
};

export default Mainbar;