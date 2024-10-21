import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { papersAtom } from '../Atoms/papersAtom.tsx';
import axios from 'axios';
import { Paper } from "../services/Api.ts";
import '../Css/PaperList.css';
import { useNavigate } from 'react-router-dom';

const PaperList: React.FC = () => {
    const [papers, setPapers] = useAtom<Paper[]>(papersAtom); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortOrder, setSortOrder] = useState('asc'); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/Paper/all');
                setPapers(response.data);  
            } catch (error) {
                console.error('Failed to fetch papers:', error);
            }
        };
        fetchPapers();
    }, [setPapers]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
    };

    const filteredPapers = papers
        .filter((paper) => paper.name!.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.price! - b.price!;
            } else {
                return b.price! - a.price!;
            }
        });

    //  individual paper's detail page
    const viewProduct = (paperId: number) => {
        navigate(`/paper/${paperId}`); 
    };

    return (
        <div className="paper-list-container">
        
            <div className="search-sort-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select onChange={handleSortChange} value={sortOrder}>
                    <option value="asc">Sort by Price: Low to High</option>
                    <option value="desc">Sort by Price: High to Low</option>
                </select>
            </div>

            {/* Product Grid */}
            {filteredPapers.length === 0 ? (
                <p>No papers match your search.</p>
            ) : (
                <div className="paper-grid">
                    {filteredPapers.map((paper: Paper) => (
                        <div
                            key={paper.id}
                            className="paper-card"
                            onClick={() => viewProduct(paper.id!)}  
                        >
                            <div className="paper-card-content">
                                <h3>{paper.name}</h3>
                                <p>{paper.price} kr</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaperList;
