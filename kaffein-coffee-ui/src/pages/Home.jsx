import React from "react";
import MySlider from "../components/home/MainSlider";
import Products from "../components/home/Products";
import LoyaltyCard from "../components/home/LoyaltyCard";
import Customer from "../components/home/Customer";
import { useLanguage } from "../Context/LanguageContext";

const Home = () => {
  const { languageId, setLanguageId } = useLanguage(); // setLanguageId əlavə edildi

  const handleLanguageChange = (e) => {
    setLanguageId(Number(e.target.value)); // Dil dəyişikliyini yeniləyirik
  };

  return (
    <div className="home-wrapper">
      <div className="home">
   

        <MySlider languageId={languageId} />
        <div className="section-wrapper">
          <Products languageId={languageId} />
          <LoyaltyCard languageId={languageId} />
          <Customer languageId={languageId} />
        </div>
      </div>
    </div>
  );
};

export default Home;