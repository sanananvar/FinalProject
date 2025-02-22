import React from "react";
import { Link } from "react-router-dom";


const Thanks = () => {
  return (
    <div className="thanks-wrapper">
      <div className="thanks">
        <img src="/public/kaffeinTextLogo.svg" alt="" />
        <h2>Thanks for choosing us!</h2>
        <Link to="/">Back to home page</Link>
      </div>
    </div>
  );
};

export default Thanks;
