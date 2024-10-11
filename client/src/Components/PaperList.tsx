import  { useEffect } from 'react';
import { useAtom } from 'jotai';
import { papersAtom } from '../Atoms/papersAtom.tsx'; 
import axios from 'axios';
import{cartAtom} from "../Atoms/cartAtom.tsx";
import{Paper} from "../services/Api.ts";
import '../Css/PaperList.css';
import { useNavigate } from 'react-router-dom';


type Cart = {
    [paperId: number]: number;  
};

const PaperList = () => {
    const [papers, setPapers] = useAtom<Paper[]>(papersAtom);
    const [cart, setCart] = useAtom<Cart>(cartAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/Paper');
                setPapers(response.data);
            } catch (error) {
                console.error('Failed to fetch papers:', error);
            }
        };
        fetchPapers();
    }, [setPapers]);

    const addToCart = (paperId: number) => {
        setCart((prevCart) => ({
            ...prevCart,
            [paperId]: (prevCart[paperId] || 0) + 1,
        }));
    };

    const removeFromCart = (paperId: number) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[paperId] > 1) {
                updatedCart[paperId]--;
            } else {
                delete updatedCart[paperId];
            }
            return updatedCart;
        });
    };

    return (
        <div className="paper-list">
            {papers.length === 0 ? (
                <p>No papers available.</p>
            ) : (
                papers && papers.length > 0 && papers.map((paper: Paper) => (
                    <div key={paper.id} className="paper-item">
                        <div className="paper-info">
                            <h3>{paper.name}</h3>
                            <p>{paper.price} kr</p>
                        </div>
                        <div className="paper-actions">
                            <button onClick={() => removeFromCart(paper.id!)}>-</button>
                            <span>{cart[paper.id!] || 0}</span>  
                            <button onClick={() => addToCart(paper.id!)}>+</button>
                            <button className="cart-btn" onClick={() => addToCart(paper.id!)}>
                                <img src="/path/to/cart-icon.png" alt="Add to Cart" />
                            </button>
                        </div>
                    </div>
                ))
            )}
            
            <button onClick={() => navigate('/cart')}>
                View Cart ({Object.keys(cart).length})
            </button>
        </div>
    );
};

export default PaperList;
