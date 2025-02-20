import React from "react";
import FooterNav from "./utils/FooterNav";
import CenterLogo from "./utils/CenterLogo";
import SocialsBar from "../header/socials/SocialsBar";
import Copyright from "./utils/Copyright";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer">
        <div className="wrapp">
          <FooterNav />
          <CenterLogo />
          <SocialsBar />
        </div>
        <Copyright/>
      </div>
    </div>
  );
};

export default Footer;
