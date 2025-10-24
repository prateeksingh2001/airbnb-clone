// server/routes/properties.js
const router = require('express').Router();
const Property = require('../models/property.model');
const auth = require('../middleware/auth');

// NOTE: Image upload logic with Multer/Cloudinary is complex.
// For this guide, we'll assume 'images' is an array of URLs passed in the request body.
// A full implementation would use 'multer' here to handle file uploads.

// CREATE a new property listing (Protected Route)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, address, price, images } = req.body;

        if (!title || !description || !address || !price) {
             return res.status(400).json({ msg: "Please enter all required fields." });
        }

        const newProperty = new Property({
            title,
            description,
            address,
            price,
            images,
            owner: req.user // Get owner ID from authenticated user
        });

        const savedProperty = await newProperty.save();
        res.json(savedProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ all property listings (Public Route)
// This includes search, filter, and pagination logic from Section 4.4
router.get('/', async (req, res) => {
    try {
        // Destructure query parameters
        const { search, maxPrice, page = 1, limit = 10 } = req.query;

        // Build query object
        let query = {};

        if (search) {
            // Case-insensitive text search on title and address
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        if (maxPrice) {
            // Filter by price (less than or equal to)
            query.price = { $lte: Number(maxPrice) };
        }

        // Calculate skip for pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Execute query with pagination and population
        const properties = await Property.find(query)
            .populate('owner', 'name')
            .limit(Number(limit))
            .skip(skip)
            .sort({ createdAt: -1 }); // Show newest first

        // Get total count for pagination
        const totalProperties = await Property.countDocuments(query);

        res.json({
            properties,
            totalPages: Math.ceil(totalProperties / Number(limit)),
            currentPage: Number(page)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ a single property by ID (Public Route)
router.get('/:id', async (req, res) => {
    try {
        // Populate owner name and also populate user info within reviews
        const property = await Property.findById(req.params.id)
            .populate('owner', 'name')
            .populate('reviews.user', 'name'); 

        if (!property) return res.status(404).json({ msg: 'Property not found' });
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE a property listing (Protected Route)
router.put('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        // Check if the user owns the property
        if (property.owner.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a property listing (Protected Route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        if (property.owner.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        res.json(deletedProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE a new review for a property (Protected Route)
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || !comment) {
            return res.status(400).json({ msg: "Please provide a rating and comment." });
        }

        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        const newReview = {
            user: req.user,
            rating: Number(rating),
            comment
        };

        property.reviews.push(newReview);
        await property.save();

        // Populate the new review's user info before sending back
        const updatedProperty = await Property.findById(req.params.id)
                                    .populate('reviews.user', 'name');

        res.status(201).json(updatedProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;