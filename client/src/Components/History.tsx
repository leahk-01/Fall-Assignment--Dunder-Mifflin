import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../Css/OrderHistory.css'; 

const History: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>(); 
    const location = useLocation(); 
    const { orders } = location.state as { orders: any[] }; 

    return (
        <div className="order-history-container">
            <h2>Order History for Customer {customerId}</h2>
            {orders.length === 0 ? (
                <p>No past orders</p>
            ) : (
                <table className="order-history-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th> 
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td> 
                            <td>{order.totalAmount} kr</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default History;
