import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import Pagination from "../PaginatedList/Pagination";

function Carousels() {
  const [carousels, setCarousels] = useState([]);
  const [currentLanguageId, setCurrentLanguageId] = useState(1); // Default: English
  const [showModal, setShowModal] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [editedOrder, setEditedOrder] = useState(0);
  const [editedDictionaries, setEditedDictionaries] = useState([]);
  const [editedImageFile, setEditedImageFile] = useState(null);
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
      navigate("/login");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Parameterized GetData function
  function GetData(currentPage = pageNumber) {
    axios
      .get(`http://localhost:5135/api/v1/client/Carousels`, {
        params: { pageNumber: currentPage, pageSize, isPaginated: true },
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Fetched carousels:", res.data.items);
        res.data.items.forEach((item) =>
          console.log(`ID: ${item.id}, ImageSrc: ${item.imageUrl}`)
        );
        console.log("API Response:", res.data);

        setCarousels(res.data.items || []);
        setPageNumber(res.data.pageNumber);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        if (error.response?.status === 401) {
          navigate("/admin/login");
        }
      });
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== pageNumber) {
      setPageNumber(newPage);
      GetData(newPage); // Fetch new page data
    }
  }

  useEffect(() => {
    const token = getAccessToken();
    console.log("token: " + token);

    if (!token) {
      navigate("/admin/login");
    } else {
      GetData(pageNumber); // Load initial data and on page change
    }
  }, [navigate, pageNumber]);

  function HandleDelete(id) {
    axios
      .delete(`http://localhost:5135/api/v1/admin/Carousels/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        if (response.status === 200 || response.status === 204) {
          console.log(`Carousel ${id} deleted successfully`);
          GetData(pageNumber); // Silinmədən sonra məlumatları yenilə
        }
      })
      .catch((error) => {
        console.log(
          "Delete error:",
          error.response?.status,
          error.response?.data
        );
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
  }

  function HandleEdit(id) {
    const carousel = carousels.find((p) => p.id === id);
    if (carousel) {
      setEditingCarousel(carousel);
      setEditedOrder(carousel.order);
      setEditedDictionaries([...carousel.carouselDictionaries]);
      setEditedImageFile(null);
      setShowModal(true);

      console.log(editedDictionaries);
    }
  }

  function HandleSave() {
    if (!editingCarousel) return;

    const formData = new FormData();
    formData.append("Order", parseFloat(editedOrder));
    if (editedImageFile) {
      formData.append("ImageFile", editedImageFile);
    }
    editedDictionaries.forEach((dict, index) => {
      formData.append(`CarouselDictionaries[${index}].Content`, dict.content);
      formData.append(
        `CarouselDictionaries[${index}].LanguageId`,
        dict.languageId
      );
    });

    console.log("Updating carousel with ID:", editingCarousel.id);
    console.log("FormData contents:", [...formData.entries()]);

    axios
      .put(
        `http://localhost:5135/api/v1/admin/Carousels/${editingCarousel.id}`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        console.log(`Carousel ${editingCarousel.id} updated successfully`);
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

  return (
    <div className="carousels">
      <Table striped bordered hover className="Table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Content</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carousels.length > 0 ? (
            carousels.map((item) => {
              const carouselName =
                item.carouselDictionaries.find(
                  (dict) => dict.languageId === currentLanguageId
                )?.content ||
                item.carouselDictionaries[0]?.content ||
                "No name";
              return (
                <tr key={item.id}>
                  <td>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        thumbnail
                        width={50}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/50")
                        }
                      />
                    ) : (
                      <span>Şəkil yoxdur</span>
                    )}
                  </td>
                  <td>{carouselName}</td>
                  <td>{item.order}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => HandleEdit(item.id)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => HandleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">boşdur</td>
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
          <Modal.Title>Edit Carousel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="carouselImageFile" className="mb-3">
              <Form.Label>Upload New Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditedImageFile(e.target.files[0])}
              />
              {editingCarousel?.imageUrl && (
                <div className="mt-2">
                  <Form.Label>Current Image:</Form.Label>
                  <Image src={editingCarousel.imageUrl} thumbnail width={100} />
                </div>
              )}
            </Form.Group>

            {editedDictionaries.map((dict, index) => (
              <Form.Group
                key={dict.languageId}
                controlId={`carouselName-${dict.languageId}`}
                className="mb-3"
              >
                <Form.Label>
                  Carousel content (Language ID: {dict.languageId})
                </Form.Label>
                <Form.Control
                  type="text"
                  value={dict.content}
                  onChange={(e) => {
                    const newDictionaries = [...editedDictionaries];
                    newDictionaries[index].content = e.target.value;
                    setEditedDictionaries(newDictionaries);
                  }}
                />
                {console.log(dict)}
              </Form.Group>
            ))}

            <Form.Group controlId="carouselOrder" className="mb-3">
              <Form.Label>Order</Form.Label>
              <Form.Control
                type="number"
                step="1"
                value={editedOrder}
                onChange={(e) => setEditedOrder(e.target.value)}
              />
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

export default Carousels;
