import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import "../../../assets/scss/pages/menu.scss";
import { useEffect, useState } from "react";

function ProductCreate() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" }); // Mesaj və tipi üçün state
  const navigate = useNavigate();

  // Token-i localStorage-dan almaq
  const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    return token ? JSON.parse(token) : null;
  };

  // Headers-ı dinamik olaraq yaratmaq
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
    } else {
      axios
        .get("http://localhost:5135/api/v1/admin/Categories", {
          headers: getAuthHeaders(),
        })
        .then((response) => {
          setCategories(flattenCategories(response.data.items));
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          if (error.response?.status === 401) {
            navigate("/admin/login");
          }
        });
    }
  }, [navigate]);

  const flattenCategories = (categories, parentName = "") => {
    let result = [];
    categories.forEach((category) => {
      const fullName = parentName
        ? `${parentName} ➝ ${
            category.categoryDictionaries.find((d) => d.languageId === 2)
              ?.name || "Unnamed"
          }`
        : category.categoryDictionaries.find((d) => d.languageId === 2)?.name ||
          "Unnamed";
      result.push({ id: category.id, name: fullName });
      if (category.subCategories && category.subCategories.length > 0) {
        result = result.concat(
          flattenCategories(category.subCategories, fullName)
        );
      }
    });
    return result;
  };

  const AddSchema = Yup.object().shape({
    price: Yup.number().required("Price is required"),
    image: Yup.mixed().required("Image is required"),
    categoryId: Yup.string().required("Category is required"),
    productDictionaries: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Dictionary name is required"),
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
        navigate("/admin/products"); // Yalnız uğurlu halda 2 saniyədən sonra yönləndir
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
        <title>Product Create</title>
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
            price: "",
            image: null,
            categoryId: "",
            productDictionaries: [
              { name: "", languageId: 1 }, // English
              { name: "", languageId: 2 }, // Azerbaijani
              { name: "", languageId: 3 }, // Russian
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
            formData.append("price", values.price);
            formData.append("image", values.image);
            formData.append("categoryId", values.categoryId);

            values.productDictionaries.forEach((dict, index) => {
              formData.append(`ProductDictionaries[${index}].Name`, dict.name);
              formData.append(
                `ProductDictionaries[${index}].LanguageId`,
                dict.languageId
              );
            });

            axios
              .post("http://localhost:5135/api/v1/admin/Products", formData, {
                headers: {
                  ...getAuthHeaders(),
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(() => {
                // Uğurlu halda yaşıl qutu və yönləndirmə
                showMessage("Məhsul uğurla əlavə olundu!", "success", true);
              })
              .catch((error) => {
                // Xəta halında qırmızı qutu, yönləndirmə yoxdur
                showMessage(
                  error.response?.data?.message ||
                    "Məhsul əlavə edilərkən xəta baş verdi!",
                  "error"
                );
                console.error(
                  "Product creation failed:",
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
                <label htmlFor="price">Price</label>
                <Field type="number" name="price" className="input-field" />
                {errors.price && (
                  <div className="error-text">{errors.price}</div>
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
                  name="image"
                  id="file"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
                {errors.image && (
                  <div className="error-text">{errors.image}</div>
                )}
                  </label>
                
              </div>

              {/* Category Select */}
              <div className="form-group">
                <label htmlFor="categoryId">Category</label>
                <Field as="select" name="categoryId" className="input-field">
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.categoryId && (
                  <div className="error-text">{errors.categoryId}</div>
                )}
              </div>

              {/* Product Dictionaries */}
              <div className="form-group">
                <label>Product Dictionaries</label>
                {values.productDictionaries.map((dict, index) => (
                  <div key={index} className="category-item">
                    <label>
                      {index === 0
                        ? "English Name"
                        : index === 1
                        ? "Azerbaijani Name"
                        : "Russian Name"}
                    </label>
                    <Field
                      type="text"
                      name={`productDictionaries[${index}].name`}
                      className="input-field"
                    />
                    {errors.productDictionaries?.[index]?.name && (
                      <div className="error-text">
                        {errors.productDictionaries[index]?.name}
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
}

export default ProductCreate;