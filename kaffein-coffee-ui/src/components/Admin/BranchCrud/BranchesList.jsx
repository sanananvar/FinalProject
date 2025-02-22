import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";

function BranchesList() {
  const [branches, setBranches] = useState([]);
  const [currentLanguageId, setCurrentLanguageId] = useState(1); // Default: English
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [editedImages, setEditedImages] = useState([]);
  const [editedDictionaries, setEditedDictionaries] = useState([]);
  const navigate = useNavigate();

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

  const checkAdminStatus = () => {
    return true; // Gerçek admin kontrolü üçün burayı güncelleyin
  };

  function GetData() {
    axios
      .get("http://localhost:5135/api/v1/admin/Branches", {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Çəkilmiş filiallar (xam məlumat):", res.data.items);
        const aktivFiliallar = res.data.items.filter((item) => !item.isDeleted);
        console.log("Filtirlənmiş filiallar (isDeleted: false):", aktivFiliallar);
        setBranches(res.data.items || []);
      })
      .catch((error) => {
        console.error("Məlumat çəkmə xətası:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        setBranches([]);
      });
  }

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      setIsAdmin(checkAdminStatus());
      GetData();
    }
  }, [navigate]);

  function HandleDelete(id) {
    axios
      .delete(`http://localhost:5135/api/v1/admin/Branches/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log(`${id} nömrəli filial uğurla silindi:`, response.data);
        GetData();
      })
      .catch((error) => {
        console.error("Silinmə xətası:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          navigate("/login");
        }
        GetData();
      });
  }

  function HandleRevert(id) {
    axios
      .put(`http://localhost:5135/api/v1/admin/Branches/revert/${id}`, null, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log(`${id} nömrəli filial uğurla geri qaytarıldı:`, response.data);
        GetData();
      })
      .catch((error) => {
        console.error(`${id} nömrəli filialı geri qaytarma xətası:`, {
          status: error.response?.status,
          data: error.response?.data,
          mesaj: error.message,
        });
        if (error.response?.status === 401) {
          navigate("/login");
        } else if (error.response?.status === 404) {
          alert(`Filial (ID: ${id}) tapılmadı. Backend-də endpoint-i yoxlayın.`);
        } else {
          GetData();
        }
      });
  }

  function HandleEdit(id) {
    const branch = branches.find((b) => b.id === id);
    if (branch) {
      setEditingBranch(branch);
      setEditedImages([]);
      setEditedDictionaries([...branch.branchDictionaries]);
      setShowModal(true);
    }
  }

  function HandleSave() {
    if (!editingBranch) return;

    const formData = new FormData();
    editedImages.forEach((file) => {
      formData.append("Images.Image", file);
    });

    editedDictionaries.forEach((dict, index) => {
      formData.append(`BranchDictionaries[${index}].Id`, dict.id || 0);
      formData.append(`BranchDictionaries[${index}].Name`, dict.name);
      formData.append(`BranchDictionaries[${index}].LanguageId`, dict.languageId);
    });

    axios
      .put(
        `http://localhost:5135/api/v1/admin/Branches/${editingBranch.id}`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        console.log(`${editingBranch.id} nömrəli filial uğurla yeniləndi`);
        setShowModal(false);
        GetData();
      })
      .catch((error) => {
        console.error("Redaktə xətası:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      });
  }

  return (
    <div className="branches">
      <Table striped bordered hover className="Table">
        <thead>
          <tr>
            <th>Şəkillər</th>
            <th>Ad</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {branches.length > 0 ? (
            branches.map((item) => {
              const branchName =
                item.branchDictionaries.find(
                  (dict) => dict.languageId === currentLanguageId
                )?.name ||
                item.branchDictionaries[0]?.name ||
                "Ad yoxdur";
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
                    {item.branchImages && item.branchImages.length > 0 ? (
                      item.branchImages.map((img, index) => (
                        <Image
                          key={index}
                          src={img.imageUrl}
                          thumbnail
                          width={50}
                          className="me-2"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/50")
                          }
                        />
                      ))
                    ) : (
                      <span>Şəkil yoxdur</span>
                    )}
                  </td>
                  <td>{branchName}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => HandleEdit(item.id)}
                      className="me-2"
                      disabled={isDeleted}
                    >
                      Redaktə
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => HandleDelete(item.id)}
                      disabled={isDeleted}
                    >
                      Sil
                    </Button>
                    {isDeleted && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => HandleRevert(item.id)}
                        className="ms-2"
                      >
                        Geri qaytar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3">Boşdur</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filialı Redaktə Et</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="branchImages" className="mb-3">
              <Form.Label>Yeni Şəkillər Yüklə</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setEditedImages(Array.from(e.target.files))}
              />
              <div className="mt-2">
                <Form.Label>Mövcud Şəkillər:</Form.Label>
                {editingBranch?.branchImages?.map((img, index) => (
                  <Image
                    key={index}
                    src={img.imageUrl}
                    thumbnail
                    width={50}
                    className="me-2"
                  />
                ))}
              </div>
            </Form.Group>

            {editedDictionaries.map((dict, index) => (
              <Form.Group
                key={dict.languageId}
                controlId={`branchName-${dict.languageId}`}
                className="mb-3"
              >
                <Form.Label>
                  Filial Adı (Dil ID: {dict.languageId})
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
            Bağla
          </Button>
          <Button variant="primary" onClick={HandleSave}>
            Dəyişiklikləri Saxla
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BranchesList;