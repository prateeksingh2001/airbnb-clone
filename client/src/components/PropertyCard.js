// client/src/components/PropertyCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', width: '300px' }}>
            <img 
                src={property.images[0] || 'https://via.placeholder.com/300x200'} 
                alt={property.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <h3>{property.title}</h3>
            <p>{property.address}</p>
            <p><strong>${property.price}</strong> / night</p>
            <Link to={`/property/${property._id}`}>View Details</Link>
        </div>
    );
};

export default PropertyCard;