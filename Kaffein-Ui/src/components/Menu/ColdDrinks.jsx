import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";

const ColdDrinks = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/products").then((res) => {
      const coldDrinks = res.data.filter(
        (product) => product.category === "Cold Drinks"
      );
      setProducts(coldDrinks);
    });
  }, []);

  const subcategories = [ 
    "Iced Bar",
    "Lemonade",
    "Freshbar",
    "Frappe",
    "Milkshake",
    "Chiller / Smoothies",
  ];

  return (
    <div>
      {subcategories.map((subcategory) => (
        <div key={subcategory} className="drinks-menu">
          <h2 className="subtitle">
            Cold Drinks
            <p>{subcategory}</p>
          </h2>
          <div className="drinks-grid">
            {products
              .filter((drink) => drink.subcategory === subcategory)
              .map((drink) => (
                <div className="drink-card" key={drink.id}>
                  <div className="card-content">
                    <h3>{drink.name}</h3>
                    <p>M / {drink.price} ₼</p>
                  </div>
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="drink-image"
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Extras Bölümü */}
      <div className="drinks-menu">
        <h2 className="subtitle">Extras</h2>
        <div className="drinks-grid">
          {products
            .filter((drink) => drink.subcategory === "Extras")
            .map((drink) => (
              <div className="drink-card" key={drink.id}>
                <div className="card-content">
                  <h3>{drink.name}</h3>
                  <p>M / {drink.price} ₼</p>
                </div>
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="drink-image"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ColdDrinks;
