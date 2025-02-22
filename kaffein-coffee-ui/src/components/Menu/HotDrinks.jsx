import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import { useLanguage } from "../../context/LanguageContext"; // contexts -> context

const HotDrinks = ({ openProductModal }) => {
  const [hotDrinksData, setHotDrinksData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("Hot Drinks");
  const [loading, setLoading] = useState(true);
  const { languageId } = useLanguage();

  useEffect(() => {
    const fetchHotDrinks = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`
        );
        console.log("Categories response:", categoriesResponse.data);
        const categories = categoriesResponse.data.items || [];

        const hotDrinksCategory = categories.find((category) =>
          category.categoryDictionaries.some((d) => d.name === "Hot Drinks")
        );

        if (hotDrinksCategory) {
          const catName =
            hotDrinksCategory.categoryDictionaries.find(
              (d) => d.languageId === languageId
            )?.name || "Hot Drinks";
          setCategoryName(catName);

          const subCategoriesList = hotDrinksCategory.subCategories.map((sub) => ({
            id: sub.id,
            name:
              sub.categoryDictionaries.find((d) => d.languageId === languageId)?.name ||
              "Unnamed",
          }));
          setSubcategories(subCategoriesList);

          const productsResponse = await axios.get(
            `http://localhost:5135/api/v1/client/Products?languageId=${languageId}`
          );
          console.log("Products response:", productsResponse.data);
          const products = productsResponse.data.items || productsResponse.data || [];

          if (!Array.isArray(products)) {
            console.error("Products massiv deyil:", products);
            setHotDrinksData([]);
            return;
          }

          const formattedDrinks = products
            .filter((product) =>
              subCategoriesList.some((sub) => sub.id === product.categoryId)
            )
            .map((product) => ({
              id: product.id,
              name:
                product.name ||
                (product.productDictionaries &&
                  product.productDictionaries.find((d) => d.languageId === languageId)?.name) ||
                "Ad yoxdur",
              price: product.price ? product.price.toString() : "0",
              imageUrl:
                product.imageUrl ||
                "https://media.istockphoto.com/id/157611890/photo/steaming-coffee-cup.jpg?s=612x612&w=0&k=20&c=YrY6jM8z8jWMz4Z0m5Qk6gQbB1nI5Oy7vOQVE4bYJ9s=",
              subcategory: subCategoriesList.find(
                (sub) => sub.id === product.categoryId
              )?.name || "Unnamed",
            }));

          setHotDrinksData(formattedDrinks);
        } else {
          console.log("Hot Drinks kateqoriyası tapılmadı");
          setHotDrinksData([]);
          setSubcategories([]);
          setCategoryName(languageId === 2 ? "İsti İçkilər" : "Hot Drinks"); // Dilə görə default
        }
      } catch (error) {
        console.error("Məlumat çəkərkən xəta:", error);
        setHotDrinksData([]);
        setSubcategories([]);
        setCategoryName(languageId === 2 ? "İsti İçkilər" : "Hot Drinks");
      } finally {
        setLoading(false);
      }
    };

    fetchHotDrinks();
  }, [languageId]);

  if (loading) {
    return <div>{languageId === 2 ? "Yüklənir..." : "Loading..."}</div>; // Dinamik loading
  }

  return (
    <>
      {subcategories.map((subcategory) => (
        <div key={subcategory.id} className="drinks-menu">
          <h2 className="subtitle">
            {categoryName}
            <p>{subcategory.name}</p>
          </h2>
          <div className="drinks-grid">
            {hotDrinksData
              .filter((drink) => drink.subcategory === subcategory.name)
              .map((drink) => (
                <div
                  className="drink-card"
                  key={drink.id}
                  onClick={() => openProductModal(drink)}
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
      ))}
    </>
  );
};

export default HotDrinks;