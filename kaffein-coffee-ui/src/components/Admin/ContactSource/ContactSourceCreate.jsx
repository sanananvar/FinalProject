import React, { useEffect, useState } from "react"; // useState əlavə edildi
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import "../../../assets/scss/pages/admin.scss"; // Stil faylı

function ContactSourceCreate() {
  const [message, setMessage] = useState({ text: "", type: "" }); // Mesaj və tipi üçün state
  const navigate = useNavigate();

  // Token-i localStorage-dan almaq
  const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : null; // String-i JSON-a çeviririk
  };

  // Headers-ı dinamik olaraq yaratmaq
  const getAuthHeaders = () => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login"); // Token yoxdursa login səhifəsinə yönləndir
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login"); // Token yoxdursa loginə yönləndir
    }
  }, [navigate]);

  const staticLanguages = [
    { id: 1, name: "English" },
    { id: 2, name: "Azerbaijani" },
    { id: 3, name: "Russian" },
  ];

  const AddSchema = Yup.object().shape({
    ContactSourceDictionaries: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Contact source name is required"),
          languageId: Yup.number().required("Language ID is required"),
        })
      )
      .length(3, "There must be exactly 3 languages"),
  });

  // Mesajı göstərmək və uğurlu halda yönləndirmə funksiyası
  const showMessage = (text, type, redirect = false) => {
    setMessage({ text, type });
    if (redirect) {
      setTimeout(() => {
        navigate("/admin"); // Yalnız uğurlu halda 2 saniyədən sonra yönləndir
      }, 2000);
    }
    // Mesajı 3 saniyədən sonra avtomatik gizlət
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

  return (
    <div className="contact-source-create-container">
      <Helmet>
        <title>Contact Source Create</title>
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
            ContactSourceDictionaries: staticLanguages.map((lang) => ({
              name: "",
              languageId: lang.id,
            })),
          }}
          validationSchema={AddSchema}
          onSubmit={(values) => {
            const token = getAccessToken();
            if (!token) {
              navigate("/login");
              return;
            }

            // FormData obyekti yaradırıq
            const formData = new FormData();
            values.ContactSourceDictionaries.forEach((dict, index) => {
              formData.append(
                `ContactSourceDictionaries[${index}].Name`,
                dict.name
              );
              formData.append(
                `ContactSourceDictionaries[${index}].LanguageId`,
                dict.languageId
              );
            });

            // Göndərilən FormData-nı konsolda yoxlamaq üçün
            console.log("FormData contents:", [...formData.entries()]);

            axios
              .post(
                "http://localhost:5135/api/v1/admin/ContactSources",
                formData,
                {
                  headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then(() => {
                // Uğurlu halda yaşıl qutu və yönləndirmə
                showMessage(
                  "Əlaqə mənbəyi uğurla əlavə olundu!",
                  "success",
                  true
                );
              })
              .catch((error) => {
                // Xəta halında qırmızı qutu, yönləndirmə yoxdur
                showMessage(
                  error.response?.data?.message ||
                    "Əlaqə mənbəyi əlavə edilərkən xəta baş verdi!",
                  "error"
                );
                console.error(
                  "Contact source creation failed:",
                  error?.response?.data || error.message
                );
                if (error.response?.status === 401) {
                  navigate("/login");
                }
              });
          }}
        >
          {({ errors, values }) => (
            <Form className="form">
              {/* Contact Source Dictionaries */}
              <div className="form-group">
                <label>Contact Source Names</label>
                {values.ContactSourceDictionaries.map((dict, index) => (
                  <div key={dict.languageId} className="contact-item">
                    <label>{staticLanguages[index].name} Name</label>
                    <Field
                      type="text"
                      name={`ContactSourceDictionaries[${index}].name`}
                      className="input-field"
                    />
                    {errors.ContactSourceDictionaries?.[index]?.name && (
                      <div className="error-text">
                        {errors.ContactSourceDictionaries[index].name}
                      </div>
                    )}
                    <Field
                      type="hidden"
                      name={`ContactSourceDictionaries[${index}].languageId`}
                    />
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
}

export default ContactSourceCreate;
