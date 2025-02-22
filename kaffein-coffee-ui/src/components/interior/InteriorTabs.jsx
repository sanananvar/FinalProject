import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../Context/LanguageContext";
import { useParams } from "react-router-dom"; // Yeni əlavə

const InteriorTabs = () => {
  const { languageId } = useLanguage();
  const { id } = useParams(); // URL-dən id-ni al
  const [toggle, setToggle] = useState(1);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const translations = {
    1: { noImages: "No images available" },
    2: { noImages: "Şəkil yoxdur" },
    3: { noImages: "Изображений нет" },
  };

  const t = translations[languageId];

  const fetchBranches = () => {
    axios
      .get("http://localhost:5135/api/v1/client/Branches")
      .then((res) => {
        console.log("Fetched branches for UI:", res.data.items);
        const activeBranches = res.data.items.filter((item) => !item.isDeleted);
        console.log("Active branches with images:", activeBranches);
        setBranches(activeBranches || []);
        const branch = activeBranches.find((b) => b.id === parseInt(id));
        setSelectedBranch(branch || activeBranches[0]); // Seçilmiş filialı təyin et
        if (activeBranches.length > 0) {
          setToggle(branch ? branch.id : activeBranches[0].id);
        }
      })
      .catch((error) => {
        console.log("Error fetching branches:", error);
        setBranches([]);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, [id]); // id dəyişdikdə yenilə

  const updateToggle = (id) => {
    setToggle(id);
  };

  if (!selectedBranch) return <p>{t.noImages}</p>;

  return (
    <div className="interior-tabs">
      <div className="interior-tabs-buttons">
        <ul className="tab-list">
          {branches.map((branch) => {
            const branchName =
              branch.branchDictionaries.find(
                (dict) => dict.languageId === languageId
              )?.name ||
              branch.branchDictionaries[0]?.name ||
              "Ad yoxdur";

            return (
              <li
                key={branch.id}
                className={`tab-item ${toggle === branch.id ? "active" : ""}`}
                onClick={() => updateToggle(branch.id)}
              >
                {branchName}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className="show-branch"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        {selectedBranch.branchImages && selectedBranch.branchImages.length > 0 ? (
          selectedBranch.branchImages.map((image, index) => {
            const columnIndex = index % 3;
            const width =
              columnIndex === 0
                ? "236px"
                : columnIndex === 1
                ? "912px"
                : "263px";

            return (
              <div className="interior-image" key={index}>
                <img
                  src={image.imageUrl}
                  alt={`${selectedBranch.branchDictionaries[0]?.name || "Branch"} image ${
                    index + 1
                  }`}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/912x697")}
                  style={{
                    width: width,
                    height: "697px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            );
          })
        ) : (
          <p>{t.noImages}</p>
        )}
      </div>
    </div>
  );
};

export default InteriorTabs;