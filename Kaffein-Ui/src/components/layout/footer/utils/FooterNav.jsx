import React from "react";
import {footerNav} from "../../../../mocks/FooterNavData.js"

const FooterNav = () => {
  return (
    <div className="footer-nav">
      <div className="footer-nav-list">
        {footerNav.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
