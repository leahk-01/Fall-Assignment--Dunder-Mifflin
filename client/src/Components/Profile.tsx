import '../Css/Profile.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
    const [customerId, setCustomerId] = useState('');
    const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', address: '', phone: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/Orders/customer-history/${customerId}`);
            const orders = response.data;
            if (orders.length > 0) {
                navigate(`/history/${customerId}`, { state: { orders } }); // Pass orders to the history page
            } else {
                navigate(`/history/${customerId}`, { state: { orders: [] } });
            }
        } catch (error) {
            setMessage('Failed to fetch order history');
        }
    };

    // Registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields 
        if (!newCustomerData.name || !newCustomerData.phone || !newCustomerData.email) {
            setMessage('Please fill in all required fields.');
            return;
        }

        if (!/^\d+$/.test(newCustomerData.phone)) {
            setMessage('Phone number must contain only digits.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/Customers/create', {
                name: newCustomerData.name,
                email: newCustomerData.email,
                address: newCustomerData.address || null, 
                phone: newCustomerData.phone,
            });
            setMessage('Account created successfully.');
            navigate(`/history/${response.data.customerId}`, { state: { orders: [] } });
        } catch (error) {
            // @ts-ignore
            if (error.response && error.response.status === 400) {
                setMessage('Failed to create account: Bad request. Please check the input data.');
            } else {
                setMessage('Failed to create account due to server error.');
            }
        }
    };


    return (
        <div className="profile-container">
            
            {/* Already a Customer Section */}
            <div className="form-box login-section">
                <h2>Already a Customer</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="customer-id">Customer ID*</label>
                        <input
                            type="text"
                            id="customer-id"
                            placeholder="Enter your ID"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>

            {/* Divider Line */}
            <div className="divider"></div>

            {/* Create an Account Section */}
            <div className="form-box register-section">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="first-name">Name*</label>
                        <input
                            type="text"
                            id="first-name"
                            placeholder="Enter your name"
                            value={newCustomerData.name}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail*</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={newCustomerData.email}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address*</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Enter your address"
                            value={newCustomerData.address}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Telephone*</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your telephone number"
                            value={newCustomerData.phone}
                            onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" className="register-button">Register</button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Profile;
