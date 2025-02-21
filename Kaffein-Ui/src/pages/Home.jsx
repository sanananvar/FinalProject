import React from "react";
import MySlider from "../components/home/MainSlider";
import Products from "../components/home/Products";
import LoyaltyCard from "../components/home/LoyaltyCard";
import Customer from "../components/home/Customer";

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home">
        <MySlider />
        <div className="section-wrapper">
          <Products />
          <LoyaltyCard/>
          <Customer/>      
        </div>
      </div>
    </div>
  );
};

export default Home;
