import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import Pagination from "../PaginatedList/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentLanguageId, setCurrentLanguageId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedDictionaries, setEditedDictionaries] = useState([]);
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editedCategoryId, setEditedCategoryId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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

  const checkAdminStatus = () => {

    return true; // Update this for real admin check
  };

  // Parameterized GetData function
  function GetData(currentPage = pageNumber) {
    axios
      .get("http://localhost:5135/api/v1/admin/Products", {
        params: { pageNumber: currentPage, pageSize, isPaginated: true },
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Fetched products:", res.data.items);
        res.data.items.forEach((item) => {
          console.log(
            `Product ID: ${item.id}, Name: ${item.productDictionaries[0]?.name}, IsDeleted: ${item.isDeleted}`
          );
        });

        setProducts(res.data.items || []);
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        if (error.response?.status === 401) {
          navigate("/admin/login");
        }
        setProducts([]);
      });
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== pageNumber) {
      setPageNumber(newPage);

      GetData(newPage); // Fetch new page data
    }
  }

  function GetCategories() {
    return axios
      .get("http://localhost:5135/api/v1/admin/Categories", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Categories fetched:", res.data.items);
        setCategories(res.data.items || []);
        return res.data.items; // Debug üçün geri qaytarırıq
      })
      .catch((error) => {
        console.log("Error fetching categories:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        setCategories([]);
        return [];
      });
  }

  // useEffect with pageNumber dependency
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      setIsAdmin(checkAdminStatus());

      GetData(pageNumber); // Load initial data and on page change
      GetCategories();
    }
  }, [navigate, pageNumber]);

  function findCategoryName(categories, categoryId, languageId) {
    for (const category of categories) {
      console.log(`Checking Category ID: ${category.id} against ${categoryId}`);
      if (String(category.id) === String(categoryId)) { // Tip uyğunsuzluğunu aradan qaldır
        const dict = category.categoryDictionaries.find(
          (d) => d.languageId === languageId
        );
        const name = dict?.name || category.categoryDictionaries[0]?.name || `Ad tapılmadı (Dil ID: ${languageId})`;
        console.log(`Found category: ${name} for ID: ${categoryId}`);
        return name;
      }
      if (category.subCategories && category.subCategories.length > 0) {
        const foundName = findCategoryName(category.subCategories, categoryId, languageId);
        if (foundName !== `Kateqoriya tapılmadı (ID: ${categoryId})`) {
          return foundName;
        }
      }
    }
    console.log(`Category not found for ID: ${categoryId}`);
    return `Kateqoriya tapılmadı (ID: ${categoryId})`;
  }

  function HandleDelete(id) {
    axios
      .delete(`http://localhost:5135/api/v1/admin/Products/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log(`Product ${id} deleted successfully:`, response.data);
        GetData();

      })
      .catch((error) => {
        console.log("Delete error:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          navigate("/login");
        }

        GetData();
      });
  }

  function HandleRevert(id) {
    axios
      .put(`http://localhost:5135/api/v1/admin/Products/revert/${id}`, null, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log(`${id} nömrəli məhsul uğurla geri qaytarıldı:`, response.data);
        GetData();
      })
      .catch((error) => {
        console.error(`${id} nömrəli məhsulu geri qaytarma xətası:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (error.response?.status === 401) {
          navigate("/login");
        } else if (error.response?.status === 404) {
          alert(`Məhsul (ID: ${id}) tapılmadı. Backend-də endpoint-i yoxlayın.`);
        } else {
          GetData();
        }

      });
  }

  function HandleEdit(id) {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditingProduct(product);
      setEditedPrice(product.price.toString());
      setEditedDictionaries([...product.productDictionaries]);
      setEditedImageFile(null);
      setEditedCategoryId(product.categoryId.toString());
      setShowModal(true);
    }
  }

  function flattenCategories(categories, parentName = "") {
    let result = [];
    categories.forEach((category) => {
      const fullName = parentName
        ? `${parentName} ➝ ${
            category.categoryDictionaries.find(
              (d) => d.languageId === currentLanguageId
            )?.name || "Unnamed"
          }`
        : category.categoryDictionaries.find(
            (d) => d.languageId === currentLanguageId
          )?.name || "Unnamed";
      result.push({ id: category.id, name: fullName });
      if (category.subCategories && category.subCategories.length > 0) {
        result = result.concat(
          flattenCategories(category.subCategories, fullName)
        );
      }
    });
    return result;
  }

  function HandleSave() {
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append("Price", parseFloat(editedPrice));
    formData.append("CategoryId", parseInt(editedCategoryId));
    if (editedImageFile) {
      formData.append("Image", editedImageFile);
    }
    editedDictionaries.forEach((dict, index) => {
      formData.append(`ProductDictionaries[${index}].Name`, dict.name);
      formData.append(
        `ProductDictionaries[${index}].LanguageId`,
        dict.languageId
      );
    });

    axios
      .put(
        `http://localhost:5135/api/v1/admin/Products/${editingProduct.id}`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        console.log(`Product ${editingProduct.id} updated`);
        setShowModal(false);
        GetData(pageNumber);
      })
      .catch((error) => {
        console.log("Edit error:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
  }

  return (
    <div className="products">
      <Table striped bordered hover className="Table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products
              .filter((item) => isAdmin || !item.isDeleted)
              .map((item) => {
                const productName =
                  item.productDictionaries.find(
                    (dict) => dict.languageId === currentLanguageId
                  )?.name ||
                  item.productDictionaries[0]?.name ||
                  "No name";
        const categoryName = findCategoryName(
                  categories,
                  item.categoryId
                );
                const isDeleted = item.isDeleted === true;

                return (
                  <tr
                    key={item.id}
                    style={{
                      textDecoration: isDeleted ? "line-through" : "none",
                      color: isDeleted ? "#888" : "#000",
                    }}
                  >
                    <td>
                      {item.imageSrc ? (
                        <Image
                          src={`${item.imageSrc}`}
                          thumbnail
                          width={50}
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td>{productName}</td>
                    <td>{item.price}</td>
                    <td>{categoryName}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => HandleEdit(item.id)}
                        className="me-2"
                        disabled={isDeleted}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => HandleDelete(item.id)}
                        disabled={isDeleted}
                      >
                        Delete
                      </Button>
                      {isDeleted && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => HandleRevert(item.id)}
                          className="ms-2"
                        >
                          Revert
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
          ) : (
            <tr>
              <td colSpan="5">Empty</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productImageFile" className="mb-3">
              <Form.Label>Upload New Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditedImageFile(e.target.files[0])}
              />
              {editingProduct?.imageSrc && (
                <div className="mt-2">
                  <Form.Label>Current Image:</Form.Label>
                  <Image src={editingProduct.imageSrc} thumbnail width={100} />
                </div>
              )}
            </Form.Group>

            {editedDictionaries.map((dict, index) => (
              <Form.Group
                key={dict.languageId}
                controlId={`productName-${dict.languageId}`}
                className="mb-3"
              >
                <Form.Label>
                  Product Name (Language ID: {dict.languageId})
                </Form.Label>
                <Form.Control
                  type="text"
                  value={dict.name}
                  onChange={(e) => {
                    const newDictionaries = [...editedDictionaries];
                    newDictionaries[index].name = e.target.value;
                    setEditedDictionaries(newDictionaries);
                  }}
                />
              </Form.Group>
            ))}

            <Form.Group controlId="productPrice" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="productCategoryId" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={editedCategoryId}
                onChange={(e) => setEditedCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {flattenCategories(categories).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={HandleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;