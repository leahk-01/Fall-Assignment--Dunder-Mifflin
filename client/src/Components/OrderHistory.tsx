import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '../services/Api.ts';  
import '../Css/OrderHistory.css';  

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusOptions] = useState(['pending', 'shipped', 'delivered', 'canceled']);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/Orders');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/Orders/status/${orderId}`, {
                status: newStatus,
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert('Order status updated successfully!');
        } catch (error) {
            console.error("Error updating order status:", error);
            alert('Failed to update order status');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
            <table className="order-history-table">
                <thead>
                <tr>
                    <th>Order number</th>
                    <th>Customer ID</th> 
                    <th>Order date</th>
                    <th>Delivery date</th>
                    <th>Status</th>
                    <th>Total amount</th>
                    <th>Change Status</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerId}</td> 
                        <td>{new Date(order.orderDate!).toLocaleDateString()}</td>
                        <td>{new Date(order.deliveryDate!).toLocaleDateString()}</td>
                        <td>{order.status}</td>
                        <td>{order.totalAmount} kr</td>
                        <td>
                            <select
                                value={order.status || 'pending'}
                                onChange={(e) => updateOrderStatus(order.id!, e.target.value)}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderHistory;
