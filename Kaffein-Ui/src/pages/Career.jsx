import React, { useState } from "react";
import CareerForm from "../components/career/CareerForm";
import CareerText from "../components/career/CareerText";
import Thanks from "../pages/Thanks";

const CareerPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="career-wrapper">
     <div className="career">
     {!submitted ? (
        <>
          <CareerText />
          <CareerForm setSubmitted={setSubmitted} />
        </>
      ) : (
        <Thanks/>
      )}
     </div>
    </div>
  );
};

export default CareerPage;
