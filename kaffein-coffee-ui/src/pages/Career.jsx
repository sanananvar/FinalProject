import React, { useState } from "react";
import CareerForm from "../components/career/CareerForm";
import CareerText from "../components/career/CareerText";
import axios from "axios";
import CareerList from "./Admin/Career/CareerList";
import { useLanguage } from "../Context/LanguageContext";

const CareerPage = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq
  const [submitted, setSubmitted] = useState(false);

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      successMessage: "Your CV has been successfully submitted!"
    },
    2: { // Azerbaijani
      successMessage: "Sizin CV uğurla göndərildi!"
    },
    3: { // Russian
      successMessage: "Ваше резюме успешно отправлено!"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5135/api/v1/admin/Candidates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("CV başarıyla gönderildi:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("CV send error:", error);
    }
  };

  return (
    <div className="career-wrapper">
      <div className="career">
        {!submitted ? (
          <>
            <CareerText languageId={languageId} />
            <CareerForm 
              setSubmitted={setSubmitted} 
              onSubmit={handleSubmit} 
              languageId={languageId} 
            />
          </>
        ) : (
          <>
            <p>{t.successMessage}</p>
            <CareerList languageId={languageId} />
          </>
        )}
      </div>
    </div>
  );
};

export default CareerPage;