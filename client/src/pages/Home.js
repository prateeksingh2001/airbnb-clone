// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyList from '../components/PropertyList';

const API_URL = 'http://localhost:5000/api'; // Adjust if needed

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // State for pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProperties = async () => {
        setLoading(true);
        setError('');
        try {
            // Build query params
            const params = new URLSearchParams({
                page,
                limit: 10,
            });
            if (searchTerm) params.append('search', searchTerm);
            if (maxPrice) params.append('maxPrice', maxPrice);

            const res = await axios.get(`${API_URL}/properties?${params.toString()}`);

            setProperties(res.data.properties);
            setTotalPages(res.data.totalPages);

        } catch (err) {
            console.error("Failed to fetch properties", err);
            setError("Failed to fetch properties. Please try again.");
        }
        setLoading(false);
    };

    // Fetch properties on initial load and when page changes
    useEffect(() => {
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]); 

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        fetchProperties();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Find a place to stay</h2>

            {/* Search and Filter Form */}
            <form onSubmit={handleSearch} style={{ margin: '1rem 0' }}>
                <input 
                    type="text" 
                    placeholder="Search by title or address" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input 
                    type="number"
                    placeholder="Max price per night"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading properties...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <>
                    <PropertyList properties={properties} />

                    {/* Pagination Controls */}
                    <div style={{ margin: '2rem 0', textAlign: 'center' }}>
                        <button 
                            onClick={() => setPage(p => Math.max(p - 1, 1))} 
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span style={{ margin: '0 1rem' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;