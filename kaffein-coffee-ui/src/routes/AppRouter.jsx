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
import Product from "../pages/Product";

import AdminPanel from "../pages/Admin/AdminPanel";
import Dashboard from "../components/Admin/Dashboard";
import CategoryCreate from "../components/Admin/CategoriesCrud/CategoryCreate";
import ProductCreate from "../components/Admin/ProductCrud/ProductCreate";
import Categories from "../components/Admin/CategoriesCrud/Categories";
import Products from "../components/Admin/ProductCrud/Products";
import Login from "../pages/Admin/Login";
import CareerList from "../pages/Admin/Career/CareerList";
import Thanks from "../pages/Thanks";
import CareerPersonal from "../pages/Admin/Career/CareerPersonal";
import SurveyList from "../components/Admin/SurveyList/SurveyList";
import ContactSourceCreate from "../components/Admin/ContactSource/ContactSourceCreate";
import Carousels from "../components/Admin/CarouselCrud/Carousels";
import CarouselCreate from "../components/Admin/CarouselCrud/CarouselCreate";
import BranchCreate from "../components/Admin/BranchCrud/BranchesCreate";
import BranchesList from "../components/Admin/BranchCrud/BranchesList";
import ReviewList from "../components/Admin/ReviewCrud/ReviewList";



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
        <Route path="/product" element={<Product />} />
        <Route path="/thanks" element={<Thanks />} />

        <Route path="/admin" element={<AdminPanel />}>
          {/* <Route path="carouselcreate" element={<ProductCreate />} /> */}
          <Route path="carousels" element={<Carousels />} />
          <Route path="carousels-create" element={<CarouselCreate />} />

          <Route path="career-list" element={<CareerList />}/>
          <Route path="career-list/:id" element={<CareerPersonal />} />
          <Route path="" element={<Dashboard />} />

          <Route path="categorycreate" element={<CategoryCreate />} />
          <Route path="categories" element={<Categories />} />
          <Route path="productcreate" element={<ProductCreate />} />
          <Route path="products" element={<Products />} />
          <Route path="/admin/categorycreate" element={<CategoryCreate />} />
          <Route path="/admin/survey" element={<SurveyList />} />
          <Route path="/admin/ContactSourceCreate" element={<ContactSourceCreate/>}/>
          <Route path="/admin/BranchesCreate" element={<BranchCreate/>}/>
          <Route path="/admin/BranchesList" element={<BranchesList/>}/>
          <Route path="/admin/ReviewList" element={<ReviewList/>}/>


        </Route>
        <Route path="/admin/login" element={<Login />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default AppRouter;
