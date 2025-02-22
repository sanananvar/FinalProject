import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Pagination from "../PaginatedList/Pagination";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [currentLanguageId, setCurrentLanguageId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedDictionaries, setEditedDictionaries] = useState([]);
  const [editedParentCategoryId, setEditedParentCategoryId] = useState(null);
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


  function GetData(currentPage = pageNumber) {
    axios
      .get("http://localhost:5135/api/v1/admin/Categories", {
        params: { pageNumber: currentPage, pageSize, isPaginated: true },
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Categories fetched:", res.data.items);
        setCategories(res.data.items || []);
        setAllCategories(flattenCategories(res.data.items));
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        setCategories([]);
        setAllCategories([]);
      });
  }

  function handlePageChange(newPage) {

    if (newPage >= 1 && newPage <= totalPages && newPage !== pageNumber) {
      setPageNumber(newPage);
      GetData(newPage);
    }
  }

  const flattenCategories = (categories, parentName = "") => {
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
  };
  

  function HandleDelete(id) {
    axios
      .delete(`http://localhost:5135/api/v1/admin/Categories/${id}`, {
        headers: getAuthHeaders(),
      })
      .then(() => {
        console.log(`Category ${id} deleted successfully`);
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
      .put(`http://localhost:5135/api/v1/admin/Categories/revert/${id}`, null, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log(`${id} nömrəli kateqoriya uğurla geri qaytarıldı:`, response.data);
        GetData();
      })
      .catch((error) => {
        console.error(`${id} nömrəli kateqoriyanı geri qaytarma xətası:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (error.response?.status === 401) {
          navigate("/login");
        } else if (error.response?.status === 404) {
          alert(`Kateqoriya (ID: ${id}) tapılmadı. Backend-də endpoint-i yoxlayın.`);
        } else {
          GetData();
        }

      });
  }

  function HandleEdit(id) {
    const category = findCategoryById(categories, id);
    if (category) {
      setEditingCategory(category);
      setEditedDictionaries([...category.categoryDictionaries]);
      setEditedParentCategoryId(category.parentCategoryId || null);
      setShowModal(true);
    }
  }

  function HandleSave() {
    if (!editingCategory) return;

    const updatedCategory = {
      parentCategoryId: editedParentCategoryId,
      categoryDictionaries: editedDictionaries,
    };

    axios
      .put(
        `http://localhost:5135/api/v1/admin/Categories/${editingCategory.id}`,
        updatedCategory,
        {
          headers: getAuthHeaders(),
        }
      )
      .then(() => {
        console.log(`Category ${editingCategory.id} updated successfully`);
        setShowModal(false);

        GetData(pageNumber);
      })
      .catch((error) => {
        console.log(
          "Edit error:",
          error.response?.status,
          error.response?.data
        );
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
  }

  function findCategoryById(categories, id) {
    for (const category of categories) {
      if (category.id === id) return category;

      if (category.subCategories.length > 0) {
        const found = findCategoryById(category.subCategories, id);
        if (found) return found;
      }
    }
    return null;
  }

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      GetData();
    }
  }, [navigate]);

  const renderCategoryRow = (item, level = 0) => {
    const categoryName =
      item.categoryDictionaries.find((dict) => dict.languageId === currentLanguageId)?.name ||
      item.categoryDictionaries[0]?.name ||
      "No name";
    const isDeleted = item.isDeleted === true; // isDeleted statusunu yoxla

    return (
      <>
        <tr
          key={item.id}
          style={{
            textDecoration: isDeleted ? "line-through" : "none",
            color: isDeleted ? "#888" : "#000",
          }}
        >
          <td style={{ paddingLeft: `${level * 20}px` }}>{categoryName}</td>
          <td>

            <Button
              variant="primary"
              size="sm"
              onClick={() => HandleEdit(item.id)}
              className="me-2"
              disabled={isDeleted} // Silinmiş kateqoriyaları redaktə etməyə icazə vermə
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => HandleDelete(item.id)}
              disabled={isDeleted} // Silinmiş kateqoriyaları təkrar silməyə icazə vermə
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
        {item.subCategories && item.subCategories.length > 0 &&
          item.subCategories.map((subItem) => renderCategoryRow(subItem, level + 1))}

      </>
    );
  };

  return (
    <div className="categories">

      <Table
        striped
        bordered
        hover
        className="Table"
        style={{ tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            <th style={{ minWidth: "300px", textAlign: "left" }}>Name</th>
            <th style={{ minWidth: "200px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (

            categories.map((item) => renderCategoryRow(item, 0))
          ) : (
            <tr>
              <td colSpan="2">Empty</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="parentCategoryId" className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Control
                as="select"
                value={editedParentCategoryId || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setEditedParentCategoryId(
                    value === "" ? null : Number(value)
                  );
                }}
              >
                <option value="">Select a parent category</option>
                {allCategories
                  .filter((cat) => cat.id !== editingCategory?.id)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {editedDictionaries.map((dict, index) => (
              <Form.Group
                key={dict.languageId}
                controlId={`categoryName-${dict.languageId}`}
                className="mb-3"
              >

                <Form.Label>
                  Category Name (Language ID: {dict.languageId})
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

export default Categories;
