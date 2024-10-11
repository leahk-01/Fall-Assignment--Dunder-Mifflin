import { useNavigate } from 'react-router-dom';
import '../Css/Home.css'

function Home() {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/PaperList');  
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Paper Paradise</h1>
                <p>Explore our wide range of high-quality papers for all your needs.</p>
                <button className="shop-now-btn" onClick={handleShopNow}>
                    Shop Now
                </button>
            </div>
        </div>
    );
}

export default Home;
