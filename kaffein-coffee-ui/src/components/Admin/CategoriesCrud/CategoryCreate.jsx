import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import "../../../assets/scss/pages/admin.scss";

function CategoryCreate() {
  const [categories, setCategories] = useState([]);
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
            navigate("/login"); // 401 Unauthorized olarsa loginə yönləndir
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

  const staticLanguages = [
    { id: 1, name: "English" },
    { id: 2, name: "Azerbaijani" },
    { id: 3, name: "Russian" },
  ];

  const AddSchema = Yup.object().shape({
    parentCategoryId: Yup.number().nullable(),
    categoryDictionaries: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Category name is required"),
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
        navigate("/admin/categories"); // Yalnız uğurlu halda 2 saniyədən sonra yönləndir
      }, 2000);
    }
    // Mesajı 3 saniyədən sonra avtomatik gizlət
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

  return (
    <div className="category-create-container">
      <Helmet>
        <title>Category Create</title>
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
            parentCategoryId: null,
            categoryDictionaries: staticLanguages.map((lang) => ({
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

            axios
              .post("http://localhost:5135/api/v1/admin/Categories", values, {
                headers: {
                  ...getAuthHeaders(),
                  "Content-Type": "application/json",
                },
              })
              .then(() => {
                // Uğurlu halda yaşıl qutu və yönləndirmə
                showMessage("Kateqoriya uğurla əlavə olundu!", "success", true);
              })
              .catch((error) => {
                // Xəta halında qırmızı qutu, yönləndirmə yoxdur
                showMessage(
                  error.response?.data?.message ||
                    "Kateqoriya əlavə edilərkən xəta baş verdi!",
                  "error"
                );
                console.error("Error creating category:", error);
                if (error.response?.status === 401) {
                  navigate("/login");
                }
              });
          }}
        >
          {({ errors, values, setFieldValue }) => (
            <Form className="form">
              {/* Parent Category ID - Select Options */}
              <div className="form-group">
                <label htmlFor="parentCategoryId">Parent Category</label>
                <Field
                  as="select"
                  name="parentCategoryId"
                  className="input-field select-option"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue(
                      "parentCategoryId",
                      value === "" ? null : Number(value)
                    );
                  }}
                >
                  <option value="">Select a parent category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.parentCategoryId && (
                  <div className="error-text">{errors.parentCategoryId}</div>
                )}
              </div>

              {/* Category Dictionaries - Static 3 Languages */}
              {values.categoryDictionaries.map((dict, index) => (
                <div key={dict.languageId} className="form-group category-item">
                  <label>Category Name ({staticLanguages[index].name})</label>
                  <Field
                    type="text"
                    name={`categoryDictionaries.${index}.name`}
                    className="input-field"
                  />
                  {errors.categoryDictionaries?.[index]?.name && (
                    <div className="error-text">
                      {errors.categoryDictionaries[index].name}
                    </div>
                  )}

                  <Field
                    type="hidden"
                    name={`categoryDictionaries.${index}.languageId`}
                  />
                </div>
              ))}

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

export default CategoryCreate;
