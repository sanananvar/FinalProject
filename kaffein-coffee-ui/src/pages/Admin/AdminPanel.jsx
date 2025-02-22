import React from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import "../../assets/scss/pages/admin.scss"
import adminLogo from "../../assets/images/kaffeinlogo.svg";

const AdminPanel = () => {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate(); // 👈 Yönlendirme için hook

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // 👈 Refresh token'ı da siliyoruz
    navigate("/admin/login"); // 👈 Login sayfasına yönlendir
  };

  return (
    <div className="content-bar">
      <Row noGutters>
        <Col xs={3} md={2} className="bg-dark text-white min-vh-100 p-3 side-bar">
          <div className='admin-logo'>
            <img src={adminLogo} alt="" />
            <h4>Admin</h4>
          </div>

          <Nav className="flex-column">
            {/* Dashboard */}
            <Nav.Link as={Link} to="." className="text-white">Dashboard</Nav.Link>

            {/* Carousels Section */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">Carousels</h6>
              <Nav.Link as={Link} to="carousels-create" className="text-white">Carousel Create</Nav.Link>
              <Nav.Link as={Link} to="carousels" className="text-white">Carousels List</Nav.Link>
            </div>

            {/* Products Section */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">Products</h6>
              <Nav.Link as={Link} to="productcreate" className="text-white">Product Create</Nav.Link>
              <Nav.Link as={Link} to="products" className="text-white">Products List</Nav.Link>
            </div>

            {/* Categories Section */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">Categories</h6>
              <Nav.Link as={Link} to="categorycreate" className="text-white">Category Create</Nav.Link>
              <Nav.Link as={Link} to="categories" className="text-white">Categories List</Nav.Link>
            </div>

            {/* Survey Section */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">Survey</h6>
              <Nav.Link as={Link} to="survey" className="text-white">Survey List</Nav.Link>
            </div>
            {/* contact soruce */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">ContactSource</h6>
              <Nav.Link as={Link} to="/admin/ContactSourceCreate" className="text-white">
                ContactSourceCreate
              </Nav.Link>
            </div>
            {/* candicate */}
            <div className="mt-3">
              <h6 className="text-light opacity-75">Candicate</h6>
              <Nav.Link as={Link} to="/admin/career-list" className="text-white">
              Candicate list
              </Nav.Link>
            </div>
             {/* branches */}
             <div className="mt-3">
              <h6 className="text-light opacity-75">Branches</h6>
              <Nav.Link as={Link} to="/admin/BranchesCreate" className="text-white">
              branch create
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/BranchesList" className="text-white">Branch List</Nav.Link>

            </div>
              {/* Review */}
              <div className="mt-3">
              <h6 className="text-light opacity-75">Reviews</h6>
             
              <Nav.Link as={Link} to="/admin/ReviewList" className="text-white">ReviewList</Nav.Link>

            </div>

              {/* Logout */}
              <div className="mt-3 mx-auto">
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
              </div>
          </Nav>
        </Col>

        <Col xs={9} md={10}>
          <Container fluid className="p-4 g-3">
            <Row>
              <Col>
                <Outlet />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanel;