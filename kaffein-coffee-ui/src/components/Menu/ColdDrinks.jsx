import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import { useLanguage } from "../../context/LanguageContext"; // contexts -> context

const ColdDrinks = ({ openProductModal }) => {
  const [coldDrinksData, setColdDrinksData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("Cold Drinks");
  const [loading, setLoading] = useState(true);
  const { languageId } = useLanguage();

  useEffect(() => {
    const fetchColdDrinks = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`
        );
        console.log("Categories response:", categoriesResponse.data);
        const categories = categoriesResponse.data.items || [];

        const coldDrinksCategory = categories.find((category) =>
          category.categoryDictionaries.some((d) => d.name === "Cold Drinks")
        );

        if (coldDrinksCategory) {
          const catName =
            coldDrinksCategory.categoryDictionaries.find(
              (d) => d.languageId === languageId
            )?.name || "Cold Drinks";
          setCategoryName(catName);

          const subCategoriesList = coldDrinksCategory.subCategories.map((sub) => ({
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
            setColdDrinksData([]);
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
                "https://media.istockphoto.com/id/1282148858/photo/iced-coffee-in-a-tall-glass.jpg?s=612x612&w=0&k=20&c=6i8LhJ8W4r5f2XsKXm9tN8t3i3uLqGZZvBXZmRNzX_k=",
              subcategory: subCategoriesList.find(
                (sub) => sub.id === product.categoryId
              )?.name || "Unnamed",
            }));

          setColdDrinksData(formattedDrinks);
        } else {
          console.log("Cold Drinks kateqoriyası tapılmadı");
          setColdDrinksData([]);
          setSubcategories([]);
          setCategoryName(languageId === 2 ? "Soyuq İçkilər" : "Cold Drinks"); // Dilə görə default
        }
      } catch (error) {
        console.error("Məlumat çəkərkən xəta:", error);
        setColdDrinksData([]);
        setSubcategories([]);
        setCategoryName(languageId === 2 ? "Soyuq İçkilər" : "Cold Drinks");
      } finally {
        setLoading(false);
      }
    };

    fetchColdDrinks();
  }, [languageId]);

  if (loading) {
    return <div>{languageId === 2 ? "Yüklənir..." : "Loading..."}</div>;
  }

  return (
    <div>
      {subcategories.map((subcategory) => (
        <div key={subcategory.id} className="drinks-menu">
          <h2 className="subtitle">
            {categoryName}
            <p>{subcategory.name}</p>
          </h2>
          <div className="drinks-grid">
            {coldDrinksData
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
    </div>
  );
};

export default ColdDrinks;