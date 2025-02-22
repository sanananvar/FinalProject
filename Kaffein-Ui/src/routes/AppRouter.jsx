import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import Home from "../pages/Home";
import Interior from "../pages/Interior";
import Career from "../pages/Career";
import About from "../pages/About";
import Menu from "../pages/Menu/Menu";
import Location from "../pages/Location";
import Survey from "../pages/Survey/Survey";
// import AdminPanel from "../pages/Admin/AdminPanel";
// import Dashboard from "../components/Admin/Dashboard";
// import MenuCrud from "../components/Admin/MenuCrud";
// import CategoryCreate from "../components/Admin/CategoryCreate";

const AppRouter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/About" element={<About />} />
        <Route path="/Location" element={<Location />} />
        <Route path="/interior" element={<Interior />} />
        <Route path="/career" element={<Career />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/survey" element={<Survey />} />

        {/* <Route path="/admin" element={<AdminPanel />}> */}
          {/* <Route path="" element={<Dashboard />} /> */}
          {/* <Route path="/admin/categorycreate" element={<CategoryCreate/>}/> */}
          {/* <Route path="create" element={<MenuCrud />} /> */}

        {/* </Route> */}
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default AppRouter;
