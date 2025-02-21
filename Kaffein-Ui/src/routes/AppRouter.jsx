import { Routes, useLocation } from 'react-router'
import Header from '../components/layout/header/Header';
import Footer from '../components/layout/footer/Footer';
import Home from '../pages/Home';
function AppRouter() {
    const location = useLocation();
    const isAdminRoute=location.pathname.startsWith("/admin")
  return (
    <>
      {!isAdminRoute && <Header />}
    
        <Routes>
        <Home/>
        </Routes>
        {!isAdminRoute && <Footer />}
    
      
    </>
  )
}

export default AppRouter
