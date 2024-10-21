import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PaperDto } from "../services/Api.ts";
import { useEffect, useState } from 'react';
import '../Css/PaperDetail.css';
import axios from "axios";
import { useAtom } from 'jotai';
import { addToCartAtom } from '../Atoms/cartAtom.tsx';  // Import your addToCart atom



const PaperDetail = () => {
    const { paperId } = useParams<{ paperId: string }>();
    const [paper, setPaper] = useState<PaperDto | undefined>();
    const [quantity, setQuantity] = useState(1);  
    const [, addToCart] = useAtom(addToCartAtom); 
    const navigate = useNavigate();  
    const [isAddedToCart, setIsAddedToCart] = useState(false);  


    useEffect(() => {
        const fetchPaperDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/Paper/api/paper/${paperId}`);
                setPaper(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchPaperDetails();
    }, [paperId]);

    const handleAddToCart = () => {
        if (paper) {
            addToCart({ paper, quantity });

            setIsAddedToCart(true);
        }
    };
    const handleContinueShopping = () => {
        setIsAddedToCart(false);
        navigate('/PaperList');
    };

    const handleGoToCart = () => {
        navigate('/Cart');
    };

    if (!paper) {
        return <p>Loading...</p>;
    }

    return (
        <div className="paper-detail-container">
            <div className="paper-header">
                <h1>{paper.name}</h1>
                <p className="paper-price">Price: Kr{paper.price?.toFixed(2)}</p>
                <p className="paper-stock">Stock: {paper.stock}</p>
            </div>

            {/* display all properties */}
            <div className="product-properties">
                {paper.properties?.map((prop) => (
                    <div key={prop.id} className="property-item">
                        <strong>{prop.propertyName}:</strong> {prop.propertyValue}
                    </div>
                ))}
            </div>

            {/* Quantity selection */}
            <div className="product-quantity">
                <label htmlFor="quantity">Quantity:</label>
                <select id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(q => (
                        <option key={q} value={q}>{q}</option>
                    ))}
                </select>
            </div>

            {/* Cart button */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
            </button>

            {/* confirmation popup */}
            {isAddedToCart && (
                <div className="cart-popup">
                    <div className="cart-popup-content">
                        <h2>Added to Your Cart</h2>
                        <p>{paper.name}</p>
                        <p>Quantity: {quantity}</p>
                        <p>Total: Kr{(paper.price! * quantity).toFixed(2)}</p>
                        <div className="popup-buttons">
                            <button onClick={handleContinueShopping}>Continue Shopping</button>
                            <button onClick={handleGoToCart}>Go to Cart</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaperDetail;