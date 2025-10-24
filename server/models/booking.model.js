// server/models/booking.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true, min: 0 }
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;