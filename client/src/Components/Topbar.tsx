import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Topbar.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


const TopBar = () => {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            <div className="icons">
        <span onClick={() => navigate('/search')}>
          <i className="fas fa-search"></i> 
            <span>Search</span>
        </span>
                <span onClick={() => navigate('/Login')}>
          <i className="fas fa-user"></i> 
                    <span>Profile</span>
        </span>
                <span onClick={() => navigate('/Cart')}>
          <i className="fas fa-shopping-cart"></i> 
                    <span>Cart</span>
          <span className="cart-count">1</span>
        </span>
            </div>
        </div>
    );
}; 

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <TopBar />
            <main>{children}</main>
        </>
    );
};

export default Layout;
