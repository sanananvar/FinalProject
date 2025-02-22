import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import "../../assets/scss/pages/menu.scss";
import SeasonBar from "../../components/Menu/SeasonBar";
import HotDrinks from "../../components/Menu/HotDrinks";
import ColdDrinks from "../../components/Menu/ColdDrinks";
import Food from "../../components/Menu/Food";
import Dessert from "../../components/Menu/Dessert";

function Menu() {
  const [openMenus, setOpenMenus] = useState({
    drinks: false,
    food: false,
    dessert: false,
  });

  const [openSubMenus, setOpenSubMenus] = useState({
    hotDrinks: false,
    coldDrinks: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      drinks: false,
      food: false,
      dessert: false,
      [menu]: !prev[menu],
    }));
  };

  const toggleSubMenu = (subMenu) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [subMenu]: !prev[subMenu],
    }));
  };

  return (
    <>
      <section id="menu">
        <div className="menu">
          <div className="menu-link">
            <div className="menu-item">
              <button
                onClick={() => toggleMenu("drinks")}
                className="menu-toggle"
              >
                Drinks {openMenus.drinks ? <ChevronUp /> : <ChevronDown />}
              </button>
              <div className={`submenu-list ${openMenus.drinks ? "active" : ""}`}>
                <div className="submenu-item">
                  <button
                    onClick={() => toggleSubMenu("hotDrinks")}
                    className="submenu-toggle"
                  >
                    Hot Drinks{" "}
                    {openSubMenus.hotDrinks ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div
                    className={`  hot-menu ${openSubMenus.hotDrinks ? "active" : ""
                      }`}
                  >
                    <Link to="/tea">Tea</Link>
                    <Link to="/black-tea">Black Tea</Link>
                    <Link to="/green-tea">Green Tea</Link>
                    <Link to="/herbal-tea">Herbal Tea</Link>
                    <Link to="/chai-tea">Chai Tea</Link>
                  </div>
                </div>

                <div className="submenu-item">
                  <button
                    onClick={() => toggleSubMenu("coldDrinks")}
                    className="submenu-toggle"
                  >
                    Cold Drinks{" "}
                    {openSubMenus.coldDrinks ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  <div
                    className={` cold-menu ${openSubMenus.coldDrinks ? "active" : ""
                      }`}
                  >
                    <Link to="/iced-tea">Iced Tea</Link>
                    <Link to="/cold-coffee">Cold Coffee</Link>
                    <Link to="/smoothies">Smoothies</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="menu-item">
              <button onClick={() => toggleMenu("food")} className="menu-toggle">
                Food {openMenus.food ? <ChevronUp /> : <ChevronDown />}
              </button>
              <div className={`submenu-list ${openMenus.food ? "active" : ""}`}>
                <Link to="/breakfast">Sandwich</Link>
                <Link to="/lunch">Toast</Link>
                <Link to="/dinner">Roll</Link>
                <Link to="/dinner">Salad & Bowl</Link>
              </div>
            </div>

            <div className="menu-item">
              <button
                onClick={() => toggleMenu("dessert")}
                className="menu-toggle"
              >
                Dessert {openMenus.dessert ? <ChevronUp /> : <ChevronDown />}
              </button>
              <div className={`submenu-list ${openMenus.dessert ? "active" : ""}`}>
                <Link to="/cakes">Diet Dessert </Link>
                <Link to="/ice-cream">Croissant</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SeasonBar />
      <HotDrinks />
      <ColdDrinks />
      <Food />
      <Dessert />
    </>
  );
}

export default Menu;
