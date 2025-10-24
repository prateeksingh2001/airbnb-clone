// server/routes/bookings.js
const router = require('express').Router();
const Booking = require('../models/booking.model');
const Property = require('../models/property.model');
const auth = require('../middleware/auth');

// CREATE a new booking (Protected Route)
router.post('/', auth, async (req, res) => {
    try {
        const { propertyId, checkInDate, checkOutDate } = req.body;

        if (!propertyId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ msg: "Please provide all booking details." });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ msg: "Property not found." });

        // Calculate total price (simplified)
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).json({ msg: "Check-out date must be after check-in date." });
        }

        const totalPrice = nights * property.price;

        // TODO: Add logic to check for booking conflicts (double-booking)

        const newBooking = new Booking({
            property: propertyId,
            user: req.user,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET bookings for the logged-in user (Protected Route)
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user })
            .populate('property', 'title address images')
            .sort({ checkInDate: 1 }); // Sort by upcoming

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;