import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../../Context/LanguageContext"; // Context faylının yolunu öz layihənə uyğun dəyiş
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap stilini əlavə et
import Pagination from "../PaginatedList/Pagination";

function SurveyList() {
  const { languageId } = useLanguage();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const translations = {
    1: {
      title: "Survey List",
      id: "ID",
      gender: "Gender",
      male: "Male",
      female: "Female",
      age: "Age",
      qualityPoint: "Quality Point",
      contactSource: "Contact Source",
      comment: "Comment",
      satisfactions: "Satisfactions",
      loading: "Loading...",
      error: "Error loading surveys",
      detail: "Detail",
      delete: "Delete",
      revert: "Revert",
      deleteConfirm: "Are you sure you want to delete this survey?",
      revertConfirm: "Are you sure you want to revert this survey?",
      close: "Close",
      ageOptions: ["13-17", "18-24", "24-34", "34 and above"],
      qualityOptions: ["Very Bad", "Bad", "Average", "Good", "Excellent"],
      satisfactionLevels: ["Satisfied", "Somewhat Satisfied", "Pleased", "Very Pleased"],
    },
    2: {
      title: "Sorğu Siyahısı",
      id: "ID",
      gender: "Cinsiyyət",
      male: "Kişi",
      female: "Qadın",
      age: "Yaş",
      qualityPoint: "Qiymət",
      contactSource: "Tanışlıq Mənbəyi",
      comment: "Şərh",
      satisfactions: "Məmnunluq",
      loading: "Yüklənir...",
      error: "Sorğuları yükləyərkən xəta baş verdi",
      detail: "Ətraflı",
      delete: "Sil",
      revert: "Geri qaytar",
      deleteConfirm: "Bu sorğunu silmək istədiyinizə əminsiniz?",
      revertConfirm: "Bu sorğunu geri qaytarmaq istədiyinizə əminsiniz?",
      close: "Bağla",
      ageOptions: ["13-17", "18-24", "24-34", "34 və daha yuxarı"],
      qualityOptions: ["Çox Pis", "Pis", "Orta", "Yaxşı", "Əla"],
      satisfactionLevels: ["Razı qaldım", "Biraz razı qaldım", "Məmnun", "Çox məmnun"],
    },
    3: {
      title: "Список опросов",
      id: "ID",
      gender: "Пол",
      male: "Мужчина",
      female: "Женщина",
      age: "Возраст",
      qualityPoint: "Оценка",
      contactSource: "Источник знакомства",
      comment: "Комментарий",
      satisfactions: "Удовлетворенность",
      loading: "Загрузка...",
      error: "Ошибка при загрузке опросов",
      detail: "Подробно",
      delete: "Удалить",
      revert: "Вернуть",
      deleteConfirm: "Вы уверены, что хотите удалить этот опрос?",
      revertConfirm: "Вы уверены, что хотите вернуть этот опрос?",
      close: "Закрыть",
      ageOptions: ["13-17", "18-24", "24-34", "34 и выше"],
      qualityOptions: ["Очень плохо", "Плохо", "Средне", "Хорошо", "Отлично"],
      satisfactionLevels: ["Доволен", "Немного доволен", "Удовлетворен", "Очень удовлетворен"],
    },
  };

  const t = translations[languageId];

  const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    return token ? JSON.parse(token) : null;
  };

  const getAuthHeaders = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5135/api/v1/admin/Surveys", {
        params: { pageNumber, pageSize, isPaginated: true },
        headers: getAuthHeaders(),
      });
      console.log("Fetched Surveys:", response.data);
      setSurveys(response.data.items || []);
      setPageNumber(response.data.pageNumber);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (err) {
      console.error("Error fetching surveys:", err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
      fetchSurveys(newPage, pageSize);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await axios.delete(`http://localhost:5135/api/v1/admin/Surveys/${id}`, {
        headers: getAuthHeaders(),
      });
      console.log(`Survey ${id} deleted successfully`);
      fetchSurveys();
    } catch (err) {
      console.error("Error deleting survey:", err);
      setError("Sorğu silinərkən xəta baş verdi.");
    }
  };

  const handleRevert = async (id) => {
    if (!window.confirm(t.revertConfirm)) return;

    try {
      await axios.put(`http://localhost:5135/api/v1/admin/Surveys/revert/${id}`, null, {
        headers: getAuthHeaders(),
      });
      console.log(`Survey ${id} reverted successfully`);
      fetchSurveys();
    } catch (err) {
      console.error("Error reverting survey:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 404) {
        alert(`Survey (ID: ${id}) tapılmadı. Backend-də endpoint-i yoxlayın.`);
      } else {
        setError("Sorğu geri qaytarılarkən xəta baş verdi.");
      }
    }
  };

  const handleDetail = (survey) => {
    setSelectedSurvey(survey);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSurvey(null);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <div className="survey-list">
      <h2>{t.title}</h2>
      {loading && <p>{t.loading}</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t.id}</th>
              <th>{t.gender}</th>
              <th>{t.age}</th>
              <th>{t.qualityPoint}</th>
              <th>{t.contactSource}</th>
              <th>{t.comment}</th>
              <th>{t.satisfactions}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.length > 0 ? (
              surveys.map((survey) => {
                const isDeleted = survey.isDeleted === true; // isDeleted statusunu yoxla
                const productName =
                  survey.contactSource?.contactSourceDictionaries?.find(
                    (dict) => dict.languageId === languageId
                  )?.name || "Unnamed";

                return (
                  <tr
                    key={survey.id}
                    style={{
                      textDecoration: isDeleted ? "line-through" : "none",
                      color: isDeleted ? "#888" : "#000",
                    }}
                  >
                    <td>{survey.id}</td>
                    <td>{survey.gender ? t.male : t.female}</td>
                    <td>{t.ageOptions[survey.age]}</td>
                    <td>{t.qualityOptions[survey.qualityPoint]}</td>
                    <td>{productName}</td>
                    <td>
                      <p className="comment-text">{survey.comment}</p>
                    </td>
                    <td>
                      <ul>
                        {survey.statisfactions?.map((satisfaction, index) =>
                          satisfaction.statisfactionDictionaries.map((dict) => (
                            <li key={`${index}-${dict.key}`}>
                              {dict.key}: {t.satisfactionLevels[dict.value]}
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleDetail(survey)}
                        className="me-2"
                        disabled={isDeleted}
                      >
                        {t.detail}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(survey.id)}
                        disabled={isDeleted}
                      >
                        {t.delete}
                      </Button>
                      {isDeleted && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRevert(survey.id)}
                          className="ms-2"
                        >
                          {t.revert}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">No surveys available</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Survey Details (ID: {selectedSurvey?.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSurvey && (
            <div className="modal-content-wrapper">
              <p>
                <strong>{t.gender}:</strong> {selectedSurvey.gender ? t.male : t.female}
              </p>
              <p>
                <strong>{t.age}:</strong> {t.ageOptions[selectedSurvey.age]}
              </p>
              <p>
                <strong>{t.qualityPoint}:</strong> {t.qualityOptions[selectedSurvey.qualityPoint]}
              </p>
              <p>
                <strong>{t.contactSource}:</strong>
                {selectedSurvey.contactSource?.contactSourceDictionaries?.find(
                  (dict) => dict.languageId === languageId
                )?.name || "Unnamed"}
              </p>
              <p>
                <strong>{t.comment}:</strong>
                <div
                  className="comment-text modal-comment"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    maxWidth: "100%",
                    lineHeight: "1.5",
                  }}
                >
                  {selectedSurvey.comment}
                </div>
              </p>
              <p>
                <strong>{t.satisfactions}:</strong>
              </p>
              <ul>
                {selectedSurvey.statisfactions?.map((satisfaction, index) =>
                  satisfaction.statisfactionDictionaries.map((dict) => (
                    <li key={`${index}-${dict.key}`}>
                      {dict.key}: {t.satisfactionLevels[dict.value]}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t.close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SurveyList;