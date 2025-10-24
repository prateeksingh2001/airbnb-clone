// client/src/pages/PropertyDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // Adjust if needed

const PropertyDetails = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useContext(AuthContext);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for new booking
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    // State for new review
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/properties/${id}`);
            setProperty(res.data);
        } catch (err) {
            setError('Failed to fetch property details.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProperty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setBookingError('You must be logged in to book.');
            return;
        }
        setBookingError('');
        setBookingSuccess('');

        try {
            await axios.post(`${API_URL}/bookings`, 
                { propertyId: id, checkInDate: checkIn, checkOutDate: checkOut },
                // Auth token is already in global axios headers from AuthContext
            );
            setBookingSuccess('Booking successful!');
            setCheckIn('');
            setCheckOut('');
        } catch (err) {
            setBookingError(err.response?.data?.msg || 'Booking failed.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setReviewError('You must be logged in to leave a review.');
            return;
        }
        setReviewError('');

        try {
            // The review is posted to the property's endpoint
            const res = await axios.post(`${API_URL}/properties/${id}/reviews`, 
                { rating, comment }
            );
            // Update property state with new review data
            setProperty(res.data); 
            setRating(5);
            setComment('');
        } catch (err) {
            setReviewError(err.response?.data?.msg || 'Failed to submit review.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!property) return <p>Property not found.</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{property.title}</h2>
            <img src={property.images[0] || 'https://via.placeholder.com/600x400'} alt={property.title} style={{ width: '100%', maxWidth: '600px' }} />
            <p><strong>Hosted by:</strong> {property.owner?.name || 'Unknown'}</p>
            <p>{property.description}</p>
            <p><strong>${property.price}</strong> / night</p>

            {/* --- Booking Form --- */}
            <div style={{ border: '1px solid gray', padding: '1rem', margin: '2rem 0' }}>
                <h3>Book this property</h3>
                {isAuthenticated ? (
                    <form onSubmit={handleBookingSubmit}>
                        <label>Check-in:</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                        <label>Check-out:</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                        <button type="submit">Reserve</button>
                        {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
                        {bookingSuccess && <p style={{ color: 'green' }}>{bookingSuccess}</p>}
                    </form>
                ) : (
                    <p>Please <a href="/login">log in</a> to make a booking.</p>
                )}
            </div>

            {/* --- Reviews Section --- */}
            <div>
                <h3>Reviews</h3>
                {/* Review Form */}
                {isAuthenticated && (
                    <form onSubmit={handleReviewSubmit} style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #eee' }}>
                        <h4>Leave a Review</h4>
                        <label>Rating:</label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                        </select>
                        <br />
                        <label>Comment:</label>
                        <br />
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" cols="50" required />
                        <br />
                        <button type="submit">Submit Review</button>
                        {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}
                    </form>
                )}

                {/* List of Reviews */}
                {property.reviews.length > 0 ? (
                    property.reviews.map(review => (
                        <div key={review._id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                            <p><strong>{review.user?.name || 'User'}</strong> ({review.rating} stars)</p>
                            <p>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default PropertyDetails;