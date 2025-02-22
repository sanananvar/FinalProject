import React from "react";
import InteriorText from "../components/interior/InteriorText";
import InteriorTabs from "../components/interior/InteriorTabs";
import { Link } from "react-router-dom";


const Interior = () => {
  return (
    <div className="interior-wrapper">
      <div className="interior">
        <div className="breakpoints">
          <Link to="/" className="break-link">Home </Link>
          <span> /</span>
          <Link to="/interior"> Interior</Link>
        </div>
        <InteriorText/>
        <InteriorTabs/>
      </div>
    </div>
  );
};

export default Interior;
