import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import { useLanguage } from "../../context/LanguageContext";

const SeasonBar = ({ openProductModal }) => { // Modal prop əlavə edildi
  const [drinksData, setDrinksData] = useState([]);
  const [categoryName, setCategoryName] = useState("Season Bar");
  const [loading, setLoading] = useState(true);
  const { languageId } = useLanguage();

  useEffect(() => {
    const fetchSeasonDrinks = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`
        );
        console.log("Categories response:", categoriesResponse.data);
        const categories = categoriesResponse.data.items || [];

        const seasonBarCategory = categories.find((category) =>
          category.categoryDictionaries.some((d) => d.name === "Season Bar")
        );

        if (seasonBarCategory) {
          const catName =
            seasonBarCategory.categoryDictionaries.find(
              (d) => d.languageId === languageId
            )?.name || "Season Bar";
          setCategoryName(catName);

          const productsResponse = await axios.get(
            `http://localhost:5135/api/v1/client/Products?languageId=${languageId}`
          );
          console.log("Products response:", productsResponse.data);
          const products = Array.isArray(productsResponse.data.items)
            ? productsResponse.data.items
            : Array.isArray(productsResponse.data)
            ? productsResponse.data
            : [];

          if (!Array.isArray(products)) {
            console.error("Products massiv deyil:", products);
            setDrinksData([]);
            return;
          }

          const formattedDrinks = products
            .filter((product) => product.categoryId === seasonBarCategory.id)
            .map((product) => ({
              name:
                product.name ||
                (product.productDictionaries &&
                  product.productDictionaries.find((d) => d.languageId === languageId)?.name) ||
                "Ad yoxdur",
              price: product.price ? product.price.toString() : "0",
              imageUrl:
                product.imageUrl ||
                "https://media.istockphoto.com/id/1179089343/photo/pumpkin-spice-latte-with-whipped-cream-and-cinnamon.jpg?s=612x612&w=0&k=20&c=3eW8rH4k_V8vNjzE76t_n94vMHMWnq7hApE8uKQw5LA=",
            }));

          setDrinksData(formattedDrinks);
        } else {
          console.log("Season Bar kateqoriyası tapılmadı");
          setDrinksData([]);
          setCategoryName(
            languageId === 2 ? "Mövsümi Bar" :
            languageId === 3 ? "Сезонный бар" : "Season Bar"
          );
        }
      } catch (error) {
        console.error("Məlumat çəkərkən xəta:", error);
        setDrinksData([]);
        setCategoryName(
          languageId === 2 ? "Mövsümi Bar" :
          languageId === 3 ? "Сезонный бар" : "Season Bar"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonDrinks();
  }, [languageId]);

  if (loading) {
    return <div>
      {languageId === 2 ? "Yüklənir..." :
       languageId === 3 ? "Загрузка..." : "Loading..."}
    </div>;
  }

  return (
    <div className="drinks-menu">
      <h1 className="title">
        {languageId === 2 ? "İçkilər" :
         languageId === 3 ? "Напитки" : "Drinks"}
      </h1>
      <h2 className="subtitle">{categoryName}</h2>
      <div className="drinks-grid">
        {drinksData.map((drink, index) => (
          <div
            className="drink-card"
            key={index}
            onClick={() => openProductModal(drink)} // Modal əlavə edildi
          >
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