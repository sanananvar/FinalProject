import React from "react";
import Productspage from "../components/ProductPage/Productspage";
import { useLanguage } from "../Context/LanguageContext"; // LanguageContext-i idxal edirik

function Product() {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  return (
    <>
      <Productspage languageId={languageId} />
    </>
  );
}

export default Product;