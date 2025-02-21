import { Route, Routes, useLocation } from 'react-router'
import Header from '../components/layout/header/Header';
import Footer from '../components/layout/footer/Footer';
import Home from '../pages/Home';
import Menu from '../pages/Menu/Menu';
import Survey from '../pages/Survey/Survey';
function AppRouter() {
    const location = useLocation();
    const isAdminRoute=location.pathname.startsWith("/admin")
  return (
    <>
      {!isAdminRoute && <Header />}
    
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/menu' element={<Menu/>}/>
        <Route path='/survey' element={<Survey/>}/>
        </Routes>
        {!isAdminRoute && <Footer />}

      
    </>
  )
}

export default AppRouter
