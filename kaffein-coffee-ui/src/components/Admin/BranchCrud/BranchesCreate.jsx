import React, { useEffect, useState } from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import "../../../assets/scss/pages/menu.scss";

function BranchCreate() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : null;
  };

  const getAuthHeaders = () => {
    const token = getAccessToken();
    if (!token) {
      navigate("/admin/login");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const AddSchema = Yup.object().shape({
    imageFiles: Yup.array()
      .of(Yup.mixed().required("Image is required"))
      .min(1, "At least one image is required"),
      
    branchDictionaries: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Branch name is required"),
          languageId: Yup.number().required("Language ID is required"),
        })
      )
      .length(3, "There must be exactly 3 languages"),
  });

  const showMessage = (text, type, redirect = false) => {
    setMessage({ text, type });
    if (redirect) {
      setTimeout(() => {
        navigate("/admin/BranchesList");
      }, 2000);
    }
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

  return (
    <div>
      <Helmet>
        <title>Branch Create</title>
      </Helmet>

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
            imageFiles: [],
            branchDictionaries: [
              { name: "", languageId: 1 }, // English
              { name: "", languageId: 2 }, // Azerbaijani
              { name: "", languageId: 3 }, // Russian
            ],
          }}
          validationSchema={AddSchema}
          onSubmit={(values) => {
            const token = getAccessToken();
            if (!token) {
              navigate("/admin/login");
              return;
            }

            const formData = new FormData();
            values.imageFiles.forEach((file) => {
              formData.append("ImageFiles", file);
            });

            values.branchDictionaries.forEach((dict, index) => {
              formData.append(
                `BranchDictionaries[${index}].Name`,
                dict.name
              );
              formData.append(
                `BranchDictionaries[${index}].LanguageId`,
                dict.languageId
              );
            });

            console.log("FormData content:");
            for (let [key, value] of formData.entries()) {
              console.log(`${key}: ${value}`);
            }

            axios
              .post("http://localhost:5135/api/v1/admin/Branches", formData, {
                headers: {
                  ...getAuthHeaders(),
                  "Content-Type": "multipart/form-data",
                },
                timeout: 10000, // 10 saniyə timeout
              })
              .then((response) => {
                console.log("Branch created successfully:", response.data);
                showMessage("Branch uğurla əlavə olundu!", "success", true);
              })
              .catch((error) => {
                console.error(
                  "Error creating branch:",
                  error.response?.data || error.message,
                  error.response?.status,
                  error.code
                );
                showMessage(
                  error.response?.data?.message ||
                    error.response?.data?.title ||
                    "Şəbəkə xətası: Serverə bağlantı kəsildi!",
                  "error"
                );
                if (error.response?.status === 401) {
                  navigate("/admin/login");
                }
              });
          }}
        >
          {({ errors, values, setFieldValue }) => (
            <Form className="form">
              <div className="form-group">
                <label className="custum-file-upload" htmlFor="file">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill=""
                      viewBox="0 0 24 24"
                    >
                      <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        id="SVGRepo_tracerCarrier"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill=""
                          d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="text">
                    <span>Click to upload image</span>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="imageFiles"
                    multiple
                    onChange={(event) => {
                      setFieldValue("imageFiles", Array.from(event.currentTarget.files));
                    }}
                  />
                  {errors.imageFiles && (
                    <div className="error-text">{errors.imageFiles}</div>
                  )}
                </label>
              </div>

              <div className="form-group">
                <label>Branch Dictionaries</label>
                {values.branchDictionaries.map((dict, index) => (
                  <div key={index} className="branch-item">
                    <label>
                      {index === 0
                        ? "English Name"
                        : index === 1
                        ? "Azerbaijani Name"
                        : "Russian Name"}
                    </label>
                    <Field
                      type="text"
                      name={`branchDictionaries[${index}].name`}
                      className="input-field"
                    />
                    {errors.branchDictionaries?.[index]?.name && (
                      <div className="error-text">
                        {errors.branchDictionaries[index]?.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>

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

export default BranchCreate;