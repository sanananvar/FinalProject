import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import { useLanguage } from "../../context/LanguageContext";

const Food = ({ openProductModal }) => { // Modal prop əlavə edildi
  const [foodData, setFoodData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { languageId } = useLanguage();

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`
        );
        console.log("Categories response:", categoriesResponse.data);
        const allCategories = categoriesResponse.data.items || [];

        const foodCategories = allCategories.filter((category) =>
          ["Sandwich", "Toast", "Roll", "Salad & Bowl"].some((name) =>
            category.categoryDictionaries.some((d) => d.name === name)
          )
        );

        if (foodCategories.length > 0) {
          const formattedCategories = foodCategories.map((category) => ({
            id: category.id,
            name:
              category.categoryDictionaries.find((d) => d.languageId === languageId)?.name ||
              "Unnamed",
          }));
          setCategories(formattedCategories);

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
            setFoodData([]);
            return;
          }

          const formattedFood = products
            .filter((product) =>
              formattedCategories.some((cat) => cat.id === product.categoryId)
            )
            .map((product) => ({
              name:
                product.name ||
                (product.productDictionaries &&
                  product.productDictionaries.find((d) => d.languageId === languageId)?.name) ||
                "Ad yoxdur",
              price: product.price ? product.price.toString() : "0",
              imageUrl:
                product.imageUrl ||
                "https://media.istockphoto.com/id/1397193477/photo/club-sandwich-made-with-bacon-ham-turkey-cheese-lettuce-and-tomato.jpg?s=612x612&w=0&k=20&c=fjNyxTEA0L88bqENs8_SKMnfAOyWlNPGxLIxz9nsSss=",
              category: formattedCategories.find((cat) => cat.id === product.categoryId)?.name || "Unnamed",
            }));

          setFoodData(formattedFood);
        } else {
          console.log("Food ilə bağlı kateqoriyalar tapılmadı");
          setFoodData([]);
          setCategories([
            { id: null, name: languageId === 2 ? "Sendviç" : languageId === 3 ? "Сэндвич" : "Sandwich" },
            { id: null, name: languageId === 2 ? "Tost" : languageId === 3 ? "Тост" : "Toast" },
            { id: null, name: languageId === 2 ? "Roll" : languageId === 3 ? "Ролл" : "Roll" },
            { id: null, name: languageId === 2 ? "Salat və Bowl" : languageId === 3 ? "Салат и Боул" : "Salad & Bowl" },
          ]);
        }
      } catch (error) {
        console.error("Məlumat çəkərkən xəta:", error);
        setFoodData([]);
        setCategories([
          { id: null, name: languageId === 2 ? "Sendviç" : languageId === 3 ? "Сэндвич" : "Sandwich" },
          { id: null, name: languageId === 2 ? "Tost" : languageId === 3 ? "Тост" : "Toast" },
          { id: null, name: languageId === 2 ? "Roll" : languageId === 3 ? "Ролл" : "Roll" },
          { id: null, name: languageId === 2 ? "Salat və Bowl" : languageId === 3 ? "Салат и Боул" : "Salad & Bowl" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [languageId]);

  if (loading) {
    return <div>
      {languageId === 2 ? "Yüklənir..." :
       languageId === 3 ? "Загрузка..." : "Loading..."}
    </div>;
  }

  return (
    <div className="Food-menu">
      <h1 className="title">
        {languageId === 2 ? "Yeməklər" :
         languageId === 3 ? "Еда" : "Food"}
      </h1>
      {categories.map((category) => (
        <div key={category.id || category.name}>
          <h2 className="subtitle">{category.name}</h2>
          <div className="Food-grid">
            {foodData
              .filter((food) => food.category === category.name)
              .map((food, index) => (
                <div
                  className="Food-card"
                  key={index}
                  onClick={() => openProductModal(food)} // Modal əlavə edildi
                >
                  <div className="Food-content">
                    <h3>{food.name}</h3>
                    <p className="food-description">
                      {languageId === 2 ? "(Lorem ipsum dolor sit amet.)" :
                       languageId === 3 ? "(Лорем ипсум долор сит амет.)" : "(Lorem ipsum dolor sit amet.)"}
                    </p>
                    <p>{food.price} ₼</p>
                  </div>
                  <img src={food.imageUrl} alt={food.name} className="Food-image" />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Food;