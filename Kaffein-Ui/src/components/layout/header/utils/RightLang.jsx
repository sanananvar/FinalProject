import React from "react";
import downArrow from "/public/downArrow.svg";

const RightLang = ({ toggleMenu }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState("En");

  const languages = ["En", "Az", "Ru"];

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
                onClick={() => {
                  setSelectedLang(lang);
                  setOpen(false);
                }}
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