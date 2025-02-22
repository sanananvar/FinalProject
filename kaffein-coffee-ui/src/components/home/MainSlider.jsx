import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const MySlider = () => {
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5135/api/v1/client/Carousels")
      .then((res) => {
        // Admin paneldən gələn məlumatları düzgün formatla
        const items = res.data.items.map((item) => ({
          imageUrl: item.imageUrl, // Admin paneldə olan şəkil
          content:
            item.carouselDictionaries.length > 0
              ? item.carouselDictionaries[0].content
              : "", // İlk dilin məzmunu
        }));
        setCarouselItems(items);
      })
      .catch((error) => {
        console.error("Error fetching carousel data:", error);
        setCarouselItems([]); // Əgər xəta olarsa boş array qoy
      });
  }, []);

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
      {carouselItems.map((item, index) => (
        <SwiperSlide key={`slide-${index}`}>
          <div
            className="slide-content"
            style={{
              backgroundImage: `url(${item.imageUrl})`, // Hər slayda admin paneldən gələn şəkil
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div className="overlay"></div> {/* Tünd fon üçün */}
            <div className="text">
              {index === 0 ? ( // İlk slaydda ikonlar olsun
                <>
                  <img
                    className="text-img"
                    src="/src/assets/images/Vector.svg"
                    alt=""
                  />
                  <img
                    className="text-img-responsive"
                    src="/src/assets/images/Responsive-Vector.svg"
                    alt=""
                  />
                </>
              ) : (
                <h2 className="text-two">{item.content || "No Title"}</h2>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MySlider;
