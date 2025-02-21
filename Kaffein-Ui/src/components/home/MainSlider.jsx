import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; 


import "swiper/css";
import "swiper/css/pagination";


const MySlider = () => {
  let sliderData=[
    '', 'Gara Garayev pr. 61','Let coffee connect us.'
  ]
  return (
    <Swiper
      modules={[Pagination, Autoplay]} 
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 8000, 
        disableOnInteraction: false,
      }}
    >
      {sliderData.map((item,index)=>index==0? (
         <SwiperSlide>
         <div className="slide-content">
           <div className="text">
             <img className="text-img" src="/src/assets/images/Vector.svg" alt="" />
             <img className="text-img-responsive" src="/src/assets/images/Responsive-Vector.svg" alt="" />
           </div>
         </div>
       </SwiperSlide>
      ):(<SwiperSlide>
        <div className="slide-content">
          <div className="text">
            <h2 className="text-two">{item}</h2>
          </div>
        </div>
      </SwiperSlide>))}
      
    </Swiper>
  );
};

export default MySlider;
