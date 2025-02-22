import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CareerPersonal = () => {
  const { id } = useParams(); // URL'deki ID'yi al
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));

        if (!token) {
          setError("Yetkilendirme hatası: Lütfen giriş yapın.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5135/api/v1/admin/Candidates/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCandidate(response.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setError("Veri çekme hatası! Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [id]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="candidate-detail">
      <h2>Haqqında</h2>
      {candidate ? (
        <div>
          <p><strong>Ad:</strong> {candidate.name}</p>
          <p><strong>Soyad:</strong> {candidate.surname}</p>
          <p><strong>Telefon:</strong> {candidate.number}</p>
          <p><strong>E-posta:</strong> {candidate.email}</p>
          {candidate.resumePath ? (
            <a href={candidate.resumePath} target="_blank" rel="noopener noreferrer">
              📄 CV Görüntüle
            </a>
          ) : (
            <p>CV Yüklenmemiş</p>
          )}
        </div>
      ) : (
        <p>Veri bulunamadı.</p>
      )}
    </div>
  );
};

export default CareerPersonal;
