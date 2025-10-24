// client/src/components/PropertyList.js
import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
            ))}
        </div>
    );
};

export default PropertyList;