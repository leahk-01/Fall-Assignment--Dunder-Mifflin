import '../Css/AddProduct.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const AddProduct: React.FC = () => {
    const [groupedProperties, setGroupedProperties] = useState<{ [key: string]: { id: number; propertyValue: string }[] }>({});
    const [name, setName] = useState<string>('');
    const [stock, setStock] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [selectedProperties, setSelectedProperties] = useState<{ [key: string]: number }>({});

    const navigate = useNavigate();  

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/Paper/properties');
                const data = await response.json();

                
                // Group properties by propertyName
                const grouped = data.reduce((groups: { [key: string]: { id: number; propertyValue: string }[] }, property: { id: number; propertyName: string; propertyValue: string }) => {
                    if (!groups[property.propertyName]) {
                        groups[property.propertyName] = [];
                    }
                    groups[property.propertyName].push({ id: property.id, propertyValue: property.propertyValue });
                    return groups;
                }, {});

                setGroupedProperties(grouped);
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const propertyIds = Object.values(selectedProperties);

        const newProduct = {
            name,
            stock,
            price,
            propertyIds, 
        };

        try {
            const response = await axios.post('http://localhost:5000/api/Paper', newProduct, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status ) {
                alert('Product created successfully');
                navigate('/Paperlist'); 
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to create product:', error);
            alert('Failed to create product');
        }
    };

    const handlePropertyChange = (propertyName: string, propertyId: number) => {
        setSelectedProperties({
            ...selectedProperties,
            [propertyName]: propertyId,
        });
    };

    return (
        <div className="form-container">
            <h1 className="form-title">New product</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Name of the product</label>
                    <input
                        className="form-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Price</label>
                    <input
                        className="form-input"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        placeholder="Enter price"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                        className="form-input"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value))}
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>

                {Object.keys(groupedProperties).map((propertyName) => (
                    <div className="form-group" key={propertyName}>
                        <label className="form-label">{propertyName}</label>
                        <select
                            className="form-select"
                            onChange={(e) =>
                                handlePropertyChange(propertyName, parseInt(e.target.value))
                            }
                        >
                            <option value="">Select {propertyName}</option>
                            {groupedProperties[propertyName].map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.propertyValue}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <button className="submit-button" type="submit">Add product</button>
            </form>
        </div>
    );
};

export default AddProduct;