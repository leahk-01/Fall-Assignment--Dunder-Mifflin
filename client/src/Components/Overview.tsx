import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '../Atoms/cartAtom';
import { customerAtom } from '../Atoms/customerAtom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrderDto } from '../services/Api.ts';

const Overview: React.FC = () => {
    const [cart] = useAtom(cartAtom);
    const [customer] = useAtom(customerAtom);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Calculate the total sum of items in the cart
    const totalCartSum = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    // Handle placing the order
    const handleOrder = async () => {
        if (!customer) {
            // If the customer is not logged in, redirect to profile page
            navigate('/profile?next=overview'); // Include the `next=overview` param
            return;
        }

        setLoading(true);
        setErrorMessage(''); // Clear previous errors

        const orderEntries = cart.map(item => ({
            paperId: item.paper.id,
            quantity: item.quantity,
        }));

        const orderData: OrderDto = {
            customerId: customer.id, // Use customerId from the atom
            orderEntries,
            status: 'Pending',
        };

        try {
            // Make POST request to place the order
            await axios.post(`/api/Orders/place-order/${customer.id}`, orderData);

            // On successful order, show success popup
            setOrderSuccess(true);
        } catch (error) {
            console.error('Order creation failed:', error);
            setErrorMessage('Failed to place the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Navigate to order history
    const navigateToHistory = () => {
        navigate(`/orders/history/${customer?.id}`);
    };

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
                    </li>
                ))}
            </ul>
            <div className="cart-total">
                <h2>Total Cart Sum: Kr{totalCartSum.toFixed(2)}</h2>
            </div>

            {/* Show error message if any */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Show order success message if the order was successful */}
            {orderSuccess ? (
                <div className="order-success-popup">
                    <p>Order successfully made!</p>
                    <button onClick={navigateToHistory}>View Order History</button>
                    <button onClick={() => navigate('/Home')}>Go to Home</button>
                </div>
            ) : (
                <button
                    className="make-order-button"
                    onClick={handleOrder}
                    disabled={loading}
                >
                    {loading ? 'Placing Order...' : 'Make Order'}
                </button>
            )}
        </div>
    );
};

export default Overview;
