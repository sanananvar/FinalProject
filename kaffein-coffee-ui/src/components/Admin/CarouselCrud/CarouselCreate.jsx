import React, { useEffect, useState } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import "../../../assets/scss/pages/menu.scss";

const CarouselCreate = () => {
    const [message, setMessage] = useState({ text: "", type: "" }); // Mesaj və tipi üçün state
    const navigate = useNavigate();

    // Token alma funksiyası
    const getAccessToken = () => {
        const token = localStorage.getItem("accessToken");
        return token ? JSON.parse(token) : null;
    };

    // Auth headers
    const getAuthHeaders = () => {
        const token = getAccessToken();
        if (!token) {
            navigate('/admin/login');
            return {};
        }
        return { Authorization: `Bearer ${token}` };
    };
  const AddSchema = Yup.object().shape({
    order: Yup.number().required("Order is required"),
    imageFile: Yup.mixed().required("Image is required"),
    carouselDictionaries: Yup.array()
      .of(
        Yup.object().shape({
          content: Yup.string().required("Dictionary content is required"),
          languageId: Yup.number().required("Language ID is required"),
        })
      )
      .length(3, "There must be exactly 3 languages"),
  });
    
    const showMessage = (text, type, redirect = false) => {
        setMessage({ text, type });
        if (redirect) {
          setTimeout(() => {
            navigate("/admin/carousels"); // Yalnız uğurlu halda 2 saniyədən sonra yönləndir
          }, 2000);
        }
        // Mesajı 3 saniyədən sonra avtomatik gizlət
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      };
    return (
        <div>
        <Helmet>
          <title>Carousel Create</title>
        </Helmet>
  
        {/* Mesaj qutusu */}
        {message.text && (
          <div
            className="notification-box"
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              padding: "15px 25px",
              borderRadius: "5px",
              color: "white",
              backgroundColor: message.type === "success" ? "#28a745" : "#dc3545",
              zIndex: 1000,
            }}
          >
            {message.text}
          </div>
        )}
  
        <div className="formik-container">
          <Formik
            initialValues={{
              order: "",
              imageFile: null,
              carouselDictionaries: [
                { content: "", languageId: 1 }, // English
                { content: "", languageId: 2 }, // Azerbaijani
                { content: "", languageId: 3 }, // Russian
              ],
            }}
            validationSchema={AddSchema}
            onSubmit={(values) => {
              const token = getAccessToken();
              if (!token) {
                navigate("/login");
                return;
              }
  
              const formData = new FormData();
              formData.append("order", values.order);
              formData.append("imageFile", values.imageFile);
              values.carouselDictionaries.forEach((dict, index) => {
                formData.append(`CarouselDictionaries[${index}].Content`, dict.content);
                formData.append(
                  `CarouselDictionaries[${index}].LanguageId`,
                  dict.languageId
                );
              });
  
              axios
                .post("http://localhost:5135/api/v1/admin/Carousels", formData, {
                  headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(() => {
                  // Uğurlu halda yaşıl qutu və yönləndirmə
                  showMessage("Slayder uğurla əlavə olundu!", "success", true);
                })
                .catch((error) => {
                  // Xəta halında qırmızı qutu, yönləndirmə yoxdur
                  showMessage(
                    error.response?.data?.message ||
                      "Slayder əlavə edilərkən xəta baş verdi!",
                    "error"
                  );
                  console.error(
                    "Carousel creation failed:",
                    error?.response?.data || error.message
                  );
                  if (error.response?.status === 401) {
                    navigate("/login");
                  }
                });
            }}
          >
            {({ errors, values, setFieldValue }) => (
              <Form className="form">
                {/* Price Field */}
                <div className="form-group">
                  <label htmlFor="price">Order</label>
                  <Field type="number" name="order" className="input-field" />
                  {errors.order && (
                    <div className="error-text">{errors.order}</div>
                  )}
                </div>
  
                {/* Image Field */}
                <div className="form-group">
                  <label className="custum-file-upload" htmlFor="file">
                    <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    </div>
                    <div className="text">
                      <span>Click to upload image</span>
                      </div>
                      <input
                        type="file"
                        id="file"
                        name="imageFile"
                        onChange={(event) => {
                          setFieldValue("imageFile", event.currentTarget.files[0]);
                        }}
                      />
                      {errors.imageFile && (
                        <div className="error-text">{errors.imageFile}</div>
                      )}
                  </label>
                </div>
  
                {/* Carousel Dictionaries */}
                <div className="form-group">
                  <label>Carousel Dictionaries</label>
                  {values.carouselDictionaries.map((dict, index) => (
                    <div key={index} className="category-item">
                      <label>
                        {index === 0
                          ? "English Content"
                          : index === 1
                          ? "Azerbaijani Content"
                          : "Russian Content"}
                      </label>
                      <Field
                        type="text"
                        name={`carouselDictionaries[${index}].content`}
                        className="input-field"
                      />
                      {errors.carouselDictionaries?.[index]?.content && (
                        <div className="error-text">
                          {errors.carouselDictionaries[index]?.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
  
                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
};

export default CarouselCreate;
