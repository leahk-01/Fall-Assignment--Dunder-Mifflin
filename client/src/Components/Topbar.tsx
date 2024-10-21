import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Topbar.css';  
import "@fortawesome/fontawesome-free/css/all.min.css";  

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            {/* History Icon on the left */}
            <div className="left-icons">
                <span onClick={() => navigate('/All-orders')}>
                    <i className="fas fa-history"></i>
                    <span>History</span>
                </span>
            </div>

            {/* Other icons on the right */}
            <div className="right-icons">
                <span onClick={() => navigate('/AddProduct')}>
                    <i className="fas fa-plus"></i>
                    <span>New</span>
                </span>
                <span onClick={() => navigate('/PaperList')}>
                    <i className="fas fa-store"></i>
                    <span>Store</span>
                </span>
                <span onClick={() => navigate('/Profile')}>
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                </span>
                <span onClick={() => navigate('/Cart')}>
                    <i className="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                </span>
            </div>
        </div>
    );
};
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <TopBar />  
            <main>
                {children} 
            </main>
        </>
    );
};

export default Layout;