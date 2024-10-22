import '../Css/Profile.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { customerAtom } from "../Atoms/customerAtom.tsx";
import { useAtom } from "jotai";
import { Customer } from "../services/Api.ts"; 

const Profile: React.FC = () => {
    const [customerId, setCustomerId] = useState('');
    const [newCustomerData, setNewCustomerData] = useState({ name: '', email: '', address: '', phone: '' });
    const [message, setMessage] = useState('');
    const [, setCustomer] = useAtom(customerAtom);
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // Extract the query parameter to determine where to redirect after login/registration
    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get('next');  

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.get<Customer>(`http://localhost:5000/api/Customers/${customerId}`);
            const customerData = response.data;

           
            setCustomer(customerData);

          
            if (next === 'overview') {
                navigate('/overview'); // Redirect to the cart overview for order placement
            } else {
                navigate(`/history/${customerData.id}`); // Redirect to the order history
            }
        } catch (error) {
            console.error('Failed to fetch customer data:', error);
            setMessage('Failed to fetch customer data');
        }
    };

    // Handle Registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const customerData = response.data;

            setCustomer(customerData);
            setMessage('Account created successfully.');

            if (next === 'overview') {
                navigate('/overview'); 
            } else {
                navigate(`/history/${customerData.id}`);
            }
        } catch (error) {
            console.error('Failed to create account:', error);
            setMessage('Failed to create account');
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
