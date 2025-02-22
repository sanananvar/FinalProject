import React, { useState } from "react";
import interiorData from "../../mocks/InteriorData"; 

const InteriorTabs = () => {
  const [toggle, setToggle] = useState(1);

  const updateToggle = (id) => {
    setToggle(id);
  };

  return (
    <div className="interior-tabs">
      <div className="interior-tabs-buttons">
        <ul className="tab-list">
          <li
            className={`tab-item ${toggle === 1 ? "active" : ""}`}
            onClick={() => updateToggle(1)}
          >
            1st Branch
          </li>
          <li
            className={`tab-item ${toggle === 2 ? "active" : ""}`}
            onClick={() => updateToggle(2)}
          >
            2nd Branch
          </li>
        </ul>
      </div>

      
      <div className={toggle === 1 ? "show-branch" : "branch"}>
        {interiorData.map((item) => (
          <div className="interior-image" key={item.id}>
            <img src={item.src} alt={item.alt} />
          </div>
        ))}
      </div>

      
      <div className={toggle === 2 ? "show-branch" : "branch"}>
        
      </div>
    </div>
  );
};

export default InteriorTabs;
