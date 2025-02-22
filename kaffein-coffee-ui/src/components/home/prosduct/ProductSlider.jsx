// import React, { useRef, useState } from "react";
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";

// export default function ProductSlider() {
//   return (
//     <>
//       <Swiper
//         className="mySwiper"
//         loop={true}
//         slidesPerView={1}
//         spaceBetween={0}
//         loopFillGroupWithBlank={false}
//         loopAdditionalSlides={2}
//       >
//         <SwiperSlide>
//           <div className="single-product">
//             <img src="/src/assets/images/image 173.svg" alt="product" />
//             <h5>Blend N8</h5>
//             <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
//             <p className="price">
//               <span>18.00</span> AZN
//             </p>
//           </div>
//         </SwiperSlide>
//         <SwiperSlide>
// <div className="single-product">
//   <img src="/src/assets/images/image 173.svg" alt="product" />
//   <h5>Blend N8</h5>
//   <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
//   <p className="price">
//     <span>18.00</span> AZN
//   </p>
// </div>
//         </SwiperSlide>
//         <SwiperSlide>
//           <div className="single-product">
//             <img src="/src/assets/images/image 173.svg" alt="product" />
//             <h5>Blend N8</h5>
//             <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
//             <p className="price">
//               <span>18.00</span> AZN
//             </p>
//           </div>
//         </SwiperSlide>
//       </Swiper>
//     </>
//   );
// }

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "../../../assets/scss/pages/home.scss";

// import required modules
const ProductSlider = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        slidesPerView={2}
        loop={true}
        scrollbar={false}
      

        className="mySwiper"
      >
       
        <SwiperSlide>
          <div className="single-product">
            <img src="/src/assets/images/image 173.svg" alt="product" />
            <h5>Blend N8</h5>
            <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
            <p className="price">
              <span>18.00</span> AZN
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="single-product">
            <img src="/src/assets/images/image 173.svg" alt="product" />
            <h5>Blend N8</h5>
            <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
            <p className="price">
              <span>18.00</span> AZN
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="single-product">
            <img src="/src/assets/images/image 173.svg" alt="product" />
            <h5>Blend N8</h5>
            <p>100 % Arabica. Gavalı, şokolad və kakao dənələri</p>
            <p className="price">
              <span>18.00</span> AZN
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ProductSlider;
