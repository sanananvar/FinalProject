import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import { useLanguage } from "../../context/LanguageContext";

const Dessert = ({ openProductModal }) => { // Modal prop əlavə edildi
  const [dessertData, setDessertData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { languageId } = useLanguage();

  useEffect(() => {
    const fetchDessertData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`
        );
        console.log("Categories response:", categoriesResponse.data);
        const allCategories = categoriesResponse.data.items || [];

        const dessertCategories = allCategories.filter((category) =>
          ["Dessert", "Diet Dessert", "Croissant", "Grab & Go"].some((name) =>
            category.categoryDictionaries.some((d) => d.name === name)
          )
        );

        if (dessertCategories.length > 0) {
          const formattedCategories = dessertCategories.map((category) => ({
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
            setDessertData([]);
            return;
          }

          const formattedDesserts = products
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
                "https://media.istockphoto.com/id/157428873/photo/chocolate-cake-with-strawberries.jpg?s=612x612&w=0&k=20&c=3mWvLh8nM96OAKR8vJTMtO_VoX92w4fLNA5k7iDZuUc=",
              category: formattedCategories.find((cat) => cat.id === product.categoryId)?.name || "Unnamed",
            }));

          setDessertData(formattedDesserts);
        } else {
          console.log("Dessert ilə bağlı kateqoriyalar tapılmadı");
          setDessertData([]);
          setCategories([
            { id: null, name: languageId === 2 ? "Desert" : languageId === 3 ? "Десерт" : "Dessert" },
            { id: null, name: languageId === 2 ? "Diyet Desert" : languageId === 3 ? "Диетический десерт" : "Diet Dessert" },
            { id: null, name: languageId === 2 ? "Kruassan" : languageId === 3 ? "Круассан" : "Croissant" },
            { id: null, name: languageId === 2 ? "Grab & Go" : languageId === 3 ? "Grab & Go" : "Grab & Go" },
          ]);
        }
      } catch (error) {
        console.error("Məlumat çəkərkən xəta:", error);
        setDessertData([]);
        setCategories([
          { id: null, name: languageId === 2 ? "Desert" : languageId === 3 ? "Десерт" : "Dessert" },
          { id: null, name: languageId === 2 ? "Diyet Desert" : languageId === 3 ? "Диетический десерт" : "Diet Dessert" },
          { id: null, name: languageId === 2 ? "Kruassan" : languageId === 3 ? "Круассан" : "Croissant" },
          { id: null, name: languageId === 2 ? "Grab & Go" : languageId === 3 ? "Grab & Go" : "Grab & Go" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDessertData();
  }, [languageId]);

  if (loading) {
    return <div>
      {languageId === 2 ? "Yüklənir..." :
       languageId === 3 ? "Загрузка..." : "Loading..."}
    </div>;
  }

  return (
    <div className="Dessert-menu">
      <h1 className="title">
        {languageId === 2 ? "Desertlər" :
         languageId === 3 ? "Десерты" : "Desserts"}
      </h1>
      {categories.map((category) => (
        <div key={category.id || category.name}>
          <h2 className="subtitle">{category.name}</h2>
          <div className="Dessert-grid">
            {dessertData
              .filter((dessert) => dessert.category === category.name)
              .map((dessert, index) => (
                <div
                  className="Dessert-card"
                  key={index}
                  onClick={() => openProductModal(dessert)} // Modal əlavə edildi
                >
                  <div className="Dessert-content">
                    <h3>{dessert.name}</h3>
                    {category.name !== (languageId === 2 ? "Grab & Go" : languageId === 3 ? "Grab & Go" : "Grab & Go") && (
                      <p className="food-description">
                        {languageId === 2 ? "(Lorem ipsum dolor sit amet.)" :
                         languageId === 3 ? "(Лорем ипсум долор сит амет.)" : "(Lorem ipsum dolor sit amet.)"}
                      </p>
                    )}
                    <p>{dessert.price} ₼</p>
                  </div>
                  <img src={dessert.imageUrl} alt={dessert.name} className="Dessert-image" />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dessert;