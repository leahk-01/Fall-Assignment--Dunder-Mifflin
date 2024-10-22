import { useAtom } from 'jotai';
import { cartAtom, removeFromCartAtom } from '../Atoms/cartAtom';  
import '../Css/Cart.css';
import {useNavigate} from "react-router-dom";  

const Cart = () => {
    const [cart] = useAtom(cartAtom);  
    const [, removeFromCart] = useAtom(removeFromCartAtom);  
    const navigate = useNavigate();

    if (cart.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    
    const totalCartSum = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            <ul>
                {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                        <h2>{item.paper.name}</h2>
                        <p>Price per item: Kr{item.pricePerItem.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total for this item: Kr{item.totalPrice.toFixed(2)}</p>
                        
                        {/* Remove item button */}
                        <button    
                            onClick={() => removeFromCart({ paper: item.paper, quantityToRemove: 1 })}  
                        >
                            Remove from Cart
                        </button>
                    </li>
                ))}
            </ul>
            <div className="cart-total">
                <h2>Total Cart Sum: Kr{totalCartSum.toFixed(2)}</h2>
            </div>
            <button className="checkout-btn" 
                    onClick={() => navigate('/Profile')}
            >Proceed to Checkout </button> 
        </div>
    );
};

export default Cart;
