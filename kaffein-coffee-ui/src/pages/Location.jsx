import React, { lazy } from "react";
import MapComponent from "../components/Location/MapComponent";
import { Link } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext"; // LanguageContext-i idxal edirik

function Location() {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      home: "Home",
      location: "Location",
      title: "Location",
      addressLabel: "Address:",
      address: "Gara Garayev pr. 61",
      hoursLabel: "Working Hours:",
      hours: "8:00 - 23:00",
      phoneLabel: "Phone:",
      phone: "+994 10 212 21 16",
      emailLabel: "Email:",
      email: "coffeekaffein@gmail.com"
    },
    2: { // Azerbaijani
      home: "Ana Səhifə",
      location: "Məkan",
      title: "Məkan",
      addressLabel: "Ünvan:",
      address: "Qara Qarayev pr. 61",
      hoursLabel: "İş Saatları:",
      hours: "8:00 - 23:00",
      phoneLabel: "Telefon:",
      phone: "+994 10 212 21 16",
      emailLabel: "E-poçt:",
      email: "coffeekaffein@gmail.com"
    },
    3: { // Russian
      home: "Главная",
      location: "Местоположение",
      title: "Местоположение",
      addressLabel: "Адрес:",
      address: "пр. Гара Гараева 61",
      hoursLabel: "Часы работы:",
      hours: "8:00 - 23:00",
      phoneLabel: "Телефон:",
      phone: "+994 10 212 21 16",
      emailLabel: "Электронная почта:",
      email: "coffeekaffein@gmail.com"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="location-wrapper">
      <div className="location">
        <div className="section-wrapper">
          <div className="bread-crumbs">
            <Link to="/" className="break-link">
              {t.home}{" "}
            </Link>
            <span> /</span>
            <Link to="/location">{t.location}</Link>
          </div>
          <div className="location-text">
            <h1>{t.title}</h1>
            <div className="mymap">
              <MapComponent />
            </div>

            <div className="location-address">
              <div className="location-card">
                <h5>
                  {t.addressLabel} <span>{t.address}</span>
                </h5>
                <h5>
                  {t.hoursLabel} <span>{t.hours}</span>
                </h5>
                <h5>
                  {t.phoneLabel} <span>{t.phone}</span>
                </h5>
                <h5>
                  {t.emailLabel} <span>{t.email}</span>
                </h5>
                <hr />
              </div>
              <div className="social-links">
                <a className="socials-item">
                  <img src="/public/facebook.svg" alt="Facebook" />
                </a>
                <a className="socials-item">
                  <img src="/public/instagram.svg" alt="Instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;