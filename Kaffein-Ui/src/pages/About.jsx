import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about">
        <div className="section-wrapper">
          <div className="bread-crumbs">
            {/* <p>Home page / Philosophy</p> */}
            <Link to="/" className="break-link">
              Home{" "}
            </Link>
            <span> /</span>
            <Link to="/about"> Philosophy</Link>
          </div>
          <div className="about-header">
            <p>Philosophy</p>
            <img src="public/kaffeinTextLogo.svg" alt="" />
          </div>
          <div className="about-text">
            <p>
              At Kaffein Coffee, we believe that every cup of coffee tells a
              story, embracing the philosophy of modern coffee. We combine the
              rich heritage of the past with the dynamic and creative touches of
              today, carefully selecting high-quality coffee beans to deliver an
              experience that speaks to both the palate and the soul with every
              sip.
            </p>
            <p>
              Always open to innovation, Kaffein Coffee welcomes its guests not
              only with flavors but also with surprises and unforgettable
              experiences. Through our campaigns and creative menus, we strive
              to make each visit a unique memory. For us, coffee is not just a
              drink but the beginning of happy moments.{" "}
            </p>
            <p>
              Our mission is to send you off with not only a perfect taste but
              also an unforgettable feeling. We are always ready to welcome you
              back with open arms!
            </p>
          </div>
          <div className="about-image">
            <img src="src/assets/images/img27.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
