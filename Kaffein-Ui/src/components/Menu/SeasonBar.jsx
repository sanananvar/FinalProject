import React from "react";
import "../../assets/scss/pages/menu.scss";
const drinksData = [
  { name: "Merry Pop Latte", price: "8.5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jneAI9_03T1uveteaNZxczuTnb9a0VJknQ&s" },
  { name: "Crispy Nut Latte", price: "8.0", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jneAI9_03T1uveteaNZxczuTnb9a0VJknQ&s" },
  { name: "Gold Flake Raf", price: "8.0", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jneAI9_03T1uveteaNZxczuTnb9a0VJknQ&s" },
  { name: "GLÜhwein (non-alcoholic)", price: "7.0", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jneAI9_03T1uveteaNZxczuTnb9a0VJknQ&s" },
  { name: "Immuni Tea", price: "7.0", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9jneAI9_03T1uveteaNZxczuTnb9a0VJknQ&s" },
];

const SeasonBar = () => {
  return (
    <div className="drinks-menu">
      <h1 className="title">Drinks</h1>
      <h2 className="subtitle">Season Bar</h2>
      <div className="drinks-grid">
        {drinksData.map((drink, index) => (
          <div className="drink-card" key={index}>
            <div className="card-content">
              <h3>{drink.name}</h3>
              <p>M / {drink.price} ₼</p>
            </div>
            <img src={drink.imageUrl} alt={drink.name} className="drink-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonBar;
