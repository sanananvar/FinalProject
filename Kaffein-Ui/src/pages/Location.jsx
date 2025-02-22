import React, { lazy } from "react";
import MapComponent from "../components/Location/MapComponent";
import { Link } from "react-router-dom";
function Location() {
  return (
    <div className="location-wrapper">
      <div className="location">
        <div className="section-wrapper">
          <div className="bread-crumbs">
            {/* <p>Home page / Location</p> */}
            <Link to="/" className="break-link">
              Home{" "}
            </Link>
            <span> /</span>
            <Link to="/location"> Location</Link>
          </div>
          <div className="location-text">
            <h1>Location</h1>
            {/* <div className="location-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.8963501984886!2d49.9436697!3d40.4111469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40306316a4a94dc5%3A0x8288b2277a26d825!2sKaffein%20Coffee!5e0!3m2!1str!2saz!4v1739221953325!5m2!1str!2saz"
                frameborder="0"
                width={1016}
                height={640}
                allowfullscreen={0}
                loading={"lazy"}
              ></iframe>
            </div> */}
            {/* <div id="map"></div> */}
            <div className="mymap">
              <MapComponent></MapComponent>
            </div>

            <div className="location-address">
              <div className="location-card">
                <h5>
                  Address: <span> Gara Garayev pr. 61</span>
                </h5>
                <h5>
                  Working Hours: <span> 8:00 - 23:00</span>
                </h5>
                <h5>
                  Phone: <span> +994 10 212 21 16</span>
                </h5>
                <h5>
                  Email: <span> coffeekaffein@gmail.com</span>
                </h5>
                <hr />
              </div>
              <div className="social-links">
                <a className="socials-item">
                  <img src="/public/facebook.svg" alt="" />
                </a>
                <a className="socials-item">
                  <img src="/public/instagram.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
