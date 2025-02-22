import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Admin/PaginatedList/Pagination";

const CareerList = () => {
  const [candidates, setCandidates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);


  const fetchCandidates = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));

      if (!token) {
        setError("Yetkilendirme hatası: Lütfen giriş yapın.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5135/api/v1/admin/Candidates",
        {
          params: { pageNumber, pageSize, isPaginated: true },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Yanıtı:", response.data);
      setPageNumber(response.data.pageNumber);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);

      if (!response.data || !Array.isArray(response.data.items)) {
        setError("Hata: API beklenen formatta değil!");
        setLoading(false);
        return;
      }

      let reversedData = [...response.data.items].reverse();
      setCandidates(reversedData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setError("Veri çekme hatası! Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
      GetData(newPage, pageSize);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="career-list">
      <h2>Müraciətlər</h2>
      <ul>
        {candidates?.map((candidate, index) => (
          <li key={index}>
            <div className="name">
              <strong>Ad:</strong> {candidate.name} <br />
              <strong>Soyad:</strong> {candidate.surname} <br />
            </div>
            {/* <strong>Telefon:</strong> {candidate.number} <br />
            <strong>E-posta:</strong> {candidate.email} <br />
            {candidate.resumePath ? (
              <a href={candidate.resumePath} target="_blank" rel="noopener noreferrer">
                📄 CV Görüntüle
              </a>
            ) : (
              <span>CV Yüklenmemiş</span>
            )} */}
            <br />
            <Link to={`/admin/career-list/${candidate.id}`}>ətraflı</Link>
            <hr />
          </li>
        ))}
      </ul>
      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CareerList;
