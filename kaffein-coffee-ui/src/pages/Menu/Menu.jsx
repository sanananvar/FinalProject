import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import axios from "axios";
import "../../assets/scss/pages/menu.scss";
import "../../assets/scss/pages/modal.scss";
import { useLanguage } from "../../context/LanguageContext";

function Menu() {
  const [openMenus, setOpenMenus] = useState({});
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [newFeedback, setNewFeedback] = useState({
    name: "",
    surname: "",
    email: "",
    feedback: "",
  });
  const [notification, setNotification] = useState("");
  const { languageId } = useLanguage();

  const fallbackReviews = [
    { id: 1, author: "Aysel", feedback: "Çox dadlıdır!" },
    { id: 2, author: "Rəşad", feedback: "Orta səviyyədə." },
    { id: 3, author: "Leyla", feedback: "Mükəmməldir!" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:5135/api/v1/client/Categories?languageId=${languageId}`),
          axios.get(`http://localhost:5135/api/v1/client/Products?languageId=${languageId}`),
        ]);

        setCategories(categoriesResponse.data.items || []);
        setProducts(productsResponse.data.items || []);
        console.log("Fetched Categories:", categoriesResponse.data.items);
        console.log("Fetched Products:", productsResponse.data.items);

        if (selectedProduct) {
          await fetchReviews(selectedProduct.id);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
        setCategories([]);
        setProducts([]);
        setReviews(fallbackReviews);
      }
    };

    fetchData();
  }, [languageId, selectedProduct]);

  const toggleMenu = useCallback((menuId) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  }, []);

  const toggleSubMenu = useCallback((subMenuId) => {
    setOpenSubMenus((prev) => ({ ...prev, [subMenuId]: !prev[subMenuId] }));
  }, []);

  const toggleFeedbackForm = useCallback(() => {
    setIsFeedbackFormOpen((prev) => !prev);
    setNotification("");
  }, []);

  const filterByCategory = useCallback((categoryId) => {
    setFilteredCategoryId(categoryId);
    console.log("Filtered Category ID:", categoryId);
  }, []);

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsFeedbackFormOpen(false);
    setNotification("");
    fetchReviews(product.id);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
    setIsFeedbackFormOpen(false);
    setNotification("");
  }, []);

  const nextReview = useCallback(() => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const prevReview = useCallback(() => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const fetchReviews = async (productId) => {
    try {
      const reviewsResponse = await axios.get(
        `http://localhost:5135/api/v1/client/Reviews?productId=${productId}&pageNumber=1&pageSize=10&isPaginated=true`
      );
      const fetchedReviews = reviewsResponse.data.items || reviewsResponse.data || [];
      const formattedReviews = fetchedReviews.map((review) => ({
        ...review,
        author: `${review.name} ${review.surname}`.trim(),
      }));
      setReviews(formattedReviews);
    } catch (error) {
      console.error("Reviews fetch error:", error);
      setReviews(fallbackReviews);
    }
  };

  const submitFeedback = useCallback(async () => {
    const { name, surname, email, feedback } = newFeedback;
    if (feedback.trim() && name.trim() && email.trim()) {
      try {
        const newReview = {
          name: name.trim(),
          surname: surname.trim(),
          email: email.trim(),
          feedback: feedback.trim(),
        };

        if (selectedProduct) {
          await axios.post(
            `http://localhost:5135/api/v1/client/Reviews?productId=${selectedProduct.id}`,
            newReview
          );
          setNotification(
            getTranslation(
              "Your review has been submitted. It will appear after admin approval.",
              "Rəyiniz göndərildi. Admin tərəfindən təsdiqləndikdən sonra görünəcək.",
              "Ваш отзыв отправлен. Он появится после одобрения администратора."
            )
          );
          await fetchReviews(selectedProduct.id);
        }

        setNewFeedback({ name: "", surname: "", email: "", feedback: "" });
        setIsFeedbackFormOpen(false);
      } catch (error) {
        console.error("Feedback submission error:", error);
        setNotification(
          getTranslation(
            "An error occurred while submitting your review. Please try again.",
            "Rəy göndərilərkən xəta baş verdi. Yenidən cəhd edin.",
            "Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте снова."
          )
        );
      }
    }
  }, [newFeedback, selectedProduct]);

  const updateFeedback = useCallback((field, value) => {
    setNewFeedback((prev) => ({ ...prev, [field]: value }));
  }, []);

  const getAllSubCategoryIds = useCallback(
    (categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      if (!category?.subCategories?.length) return [];

      return category.subCategories.reduce((ids, sub) => {
        return [...ids, sub.id, ...getAllSubCategoryIds(sub.id)];
      }, []);
    },
    [categories]
  );

  const getProductsByCategory = useCallback(
    (categoryId, includeSubCategories = true) => {
      const categoryIds = [categoryId];
      if (includeSubCategories) {
        categoryIds.push(...getAllSubCategoryIds(categoryId));
      }
      return products.filter((product) => categoryIds.includes(product.categoryId));
    },
    [products, getAllSubCategoryIds]
  );

  const categoryHasProducts = useCallback(
    (categoryId) => {
      return getProductsByCategory(categoryId, true).length > 0;
    },
    [getProductsByCategory]
  );

  const getLocalizedName = useCallback(
    (item, dictField) => {
      const dictionary = item[dictField].find((d) => d.languageId === languageId);
      return dictionary?.name || item[dictField][0]?.name || "Unnamed";
    },
    [languageId]
  );

  const getProductName = useCallback(
    (product) => {
      return getLocalizedName(product, "productDictionaries");
    },
    [getLocalizedName]
  );

  const getCategoryName = useCallback(
    (category) => {
      return getLocalizedName(category, "categoryDictionaries");
    },
    [getLocalizedName]
  );

  const ProductCard = useCallback(
    ({ product }) => (
      <div className="menu-card" onClick={() => openProductModal(product)}>
        <div className="menu-card-left">
          <div className="menu-product-content">
            <h5>{getProductName(product)}</h5>
            <p>{product.price} ₼</p>
          </div>
          <div className="menu-card-right">
            <img src={product.imageSrc || "placeholder.jpg"} alt={getProductName(product)} />
          </div>
        </div>
      </div>
    ),
    [getProductName, openProductModal]
  );

  const findCategoryById = useCallback(
    (categoryId, categoriesArray) => {
      for (const category of categoriesArray) {
        if (category.id === categoryId) {
          return category;
        }
        if (category.subCategories?.length > 0) {
          const found = findCategoryById(categoryId, category.subCategories);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const getMaxDepth = useCallback((categoriesArray, currentDepth = 0) => {
    let maxDepth = currentDepth;
    for (const category of categoriesArray) {
      if (category.subCategories?.length > 0) {
        const subDepth = getMaxDepth(category.subCategories, currentDepth + 1);
        maxDepth = Math.max(maxDepth, subDepth);
      }
    }
    return maxDepth;
  }, []);

  const maxDepth = useMemo(() => getMaxDepth(categories), [categories, getMaxDepth]);

  const renderCategoryRecursive = useCallback(
    (category, isFiltered = false, level = 0) => {
      const categoryName = getCategoryName(category);
      const directProducts = getProductsByCategory(category.id, false);
      const hasSubcategories = category.subCategories?.length > 0;
      const subCategoriesCount = category.subCategories?.length || 0;

      if (
        !isFiltered &&
        directProducts.length === 0 &&
        (!hasSubcategories || !category.subCategories.some((sub) => categoryHasProducts(sub.id)))
      ) {
        console.log(`No products or subcategories with products for ${categoryName}`);
        return null;
      }

      return (
        <div key={category.id} className={`menu-wrapper-${category.id}`}>
          {(level === 0 || directProducts.length > 0 || subCategoriesCount <= 1) && (
            <h1 className={level === maxDepth ? "category-title-light" : "category-title-bold"}>
              {categoryName}
            </h1>
          )}

          {directProducts.length > 0 && (
            <div className="menu-list">
              {directProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {hasSubcategories && (
            <div className="submenu-list">
              {category.subCategories.map((sub) => {
                const subHasMultipleSubs = subCategoriesCount > 1;
                return (
                  <div key={sub.id} className="subcategory-section">
                    {level !== 0 && subHasMultipleSubs && (
                      <h1 className={level === maxDepth ? "category-title-light" : "category-title-bold"}>
                        {categoryName}
                      </h1>
                    )}
                    {renderCategoryRecursive(
                      sub,
                      isFiltered && filteredCategoryId === category.id ? false : filteredCategoryId === sub.id,
                      level + 1
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    },
    [getCategoryName, getProductsByCategory, categoryHasProducts, ProductCard, filteredCategoryId, maxDepth]
  );

  const renderMenuItem = useCallback(
    (category, level = 0, isSubmenuActive = false) => {
      const categoryName = getCategoryName(category);
      const hasSubcategories = category.subCategories?.length > 0;
      const hasProductsOrSubProducts = categoryHasProducts(category.id);

      if (!hasProductsOrSubProducts && !hasSubcategories) {
        return null;
      }

      return (
        <div key={category.id} className="menu-item">
          <button
            className={`menu-toggle ${level > 0 ? "sub-toggle" : ""} ${
              openMenus[category.id] ? "active" : ""
            } ${isSubmenuActive && level > 0 ? "sub-toggle-2" : ""}`}
          >
            <span
              className={level === maxDepth ? "category-title-light" : "category-title-bold"}
              onClick={() => filterByCategory(category.id)}
            >
              {categoryName}
            </span>
            {hasSubcategories && (
              <span onClick={() => toggleMenu(category.id)}>
                {openMenus[category.id] ? <ChevronUp /> : <ChevronDown />}
              </span>
            )}
          </button>

          {hasSubcategories && (
            <div className={`submenu-list ${openMenus[category.id] ? "active" : ""}`}>
              {category.subCategories.map((sub) =>
                renderMenuItem(sub, level + 1, openMenus[category.id])
              )}
            </div>
          )}
        </div>
      );
    },
    [getCategoryName, categoryHasProducts, filterByCategory, openMenus, toggleMenu, maxDepth]
  );

  const filteredCategories = useMemo(() => {
    let result = [];

    if (filteredCategoryId) {
      const selectedCategory = findCategoryById(filteredCategoryId, categories);
      if (selectedCategory) {
        result = [selectedCategory];
      } else {
        console.log(`Category with ID ${filteredCategoryId} not found in categories`);
      }
    } else {
      result = categories.filter((cat) => !cat.parentCategoryId && categoryHasProducts(cat.id));
    }

    console.log("Filtered Categories:", result);
    return Array.from(new Map(result.map((cat) => [cat.id, cat])).values());
  }, [categories, filteredCategoryId, categoryHasProducts, findCategoryById]);

  const menuSections = useMemo(() => {
    return filteredCategories
      .map((category) => renderCategoryRecursive(category, filteredCategoryId === category.id))
      .filter(Boolean);
  }, [filteredCategories, filteredCategoryId, renderCategoryRecursive]);

  const rootCategories = useMemo(() => {
    return categories.filter((category) => !category.parentCategoryId && categoryHasProducts(category.id));
  }, [categories, categoryHasProducts]);

  const getTranslation = useCallback(
    (en, az, ru) => {
      return languageId === 2 ? az : languageId === 3 ? ru : en;
    },
    [languageId]
  );

  return (
    <>
      <section id="menu">
        <div className="menu">
          <div className="menu-link">
            {rootCategories.map((category) => renderMenuItem(category))}
          </div>
        </div>
      </section>

      {menuSections}

      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeProductModal}>
              X
            </span>

            <img
              src={selectedProduct.imageSrc || "placeholder.jpg"}
              alt={getProductName(selectedProduct)}
              className="modal-image"
            />

            <h2>{getProductName(selectedProduct)}</h2>
            <p>{selectedProduct.price} ₼</p>

            <div className="modal-btns">
              <button className="make-order">{getTranslation("Make an order", "Sifariş Et", "Сделать заказ")}</button>
              <button className="feedback-btn" onClick={toggleFeedbackForm}>
                {getTranslation("Give feedback", "Rəy Bildir", "Оставить отзыв")}
              </button>
            </div>

            <div className="feedback-section">
              {notification && <div className="notification">{notification}</div>}

              <h3>
                {getTranslation("Reviews", "Rəylər", "Отзывы")} ({reviews.length}{" "}
                {getTranslation("review", "rəy", "отзыв")})
              </h3>

              <div className="carousel-container">
                <button className="carousel-nav" onClick={prevReview}>
                  <ChevronLeft />
                </button>

                <div className="review-item">
                  <h4>{reviews[currentReviewIndex]?.author || "No reviews yet"}</h4>
                  <p>{reviews[currentReviewIndex]?.feedback || ""}</p>
                </div>

                {reviews.length > 1 && (
                  <div className="review-item">
                    <h4>{reviews[(currentReviewIndex + 1) % reviews.length]?.author || "No reviews yet"}</h4>
                    <p>{reviews[(currentReviewIndex + 1) % reviews.length]?.feedback || ""}</p>
                  </div>
                )}

                <button className="carousel-nav" onClick={nextReview}>
                  <ChevronRight />
                </button>
              </div>

              {isFeedbackFormOpen && (
                <div className="feedback-input">
                  <h3 className="feedback-title">{getTranslation("Give feedback", "Rəy Bildir", "Оставить отзыв")}</h3>
                  <div className="feedback-form-row">
                    <div className="form-group">
                      <label className="label" htmlFor="name">{getTranslation("Name", "Ad", "Имя")}</label>
                      <input
                        type="text"
                        id="name"
                        placeholder={getTranslation("Name", "Ad", "Имя")}
                        value={newFeedback.name}
                        onChange={(e) => updateFeedback("name", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label" htmlFor="surname">{getTranslation("Surname", "Soyad", "Фамилия")}</label>
                      <input
                        type="text"
                        id="surname"
                        placeholder={getTranslation("Surname", "Soyad", "Фамилия")}
                        value={newFeedback.surname}
                        onChange={(e) => updateFeedback("surname", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label" htmlFor="email">E-mail</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="E-mail"
                        value={newFeedback.email}
                        onChange={(e) => updateFeedback("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label" htmlFor="feedback">{getTranslation("Give feedback", "Rəy Bildir", "Оставить отзыв")}</label>
                    <textarea
                      id="feedback"
                      value={newFeedback.feedback}
                      onChange={(e) => updateFeedback("feedback", e.target.value)}
                      placeholder={getTranslation("Give feedback", "Rəy Bildir", "Оставить отзыв")}
                    />
                  </div>
                  <button className="submit-feedback" onClick={submitFeedback}>
                    {getTranslation("Send", "Göndər", "Отправить")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Menu;