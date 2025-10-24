// server/models/property.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = require('./review.schema'); // Import the embedded schema

const propertySchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }], // Array of image URLs
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviews: [reviewSchema] // Embed the review schema
}, {
  timestamps: true,
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;