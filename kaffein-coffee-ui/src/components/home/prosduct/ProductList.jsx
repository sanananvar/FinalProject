import React from "react";
import "../../../assets/scss/pages/product.scss";
const ProductList = () => {
  return (
    <>
      <div className="products-container">
        <div className="single-product">
          <img src="/src/assets/images/image 173.svg" alt="product" />
          <h5>Blend N8</h5>
          <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
          <p className="price">
            <span>18.00</span> AZN
          </p>
        </div>
        <div className="single-product">
          <img src="/src/assets/images/image 173.svg" alt="product" />
          <h5>Blend N8</h5>
          <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
          <p className="price">
            <span>18.00</span> AZN
          </p>
        </div>
        <div className="single-product">
          <img src="/src/assets/images/image 173.svg" alt="product" />
          <h5>Blend N8</h5>
          <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
          <p className="price">
            <span>18.00</span> AZN
          </p>
        </div>
      </div>
      <div className="btn">
        <button>See all</button>
      </div>
    </>
  );
};

export default ProductList;
