// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept and parse JSON in request bodies

// --- Database Connection ---
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// --- API Routes ---
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const propertiesRouter = require('./routes/properties');
app.use('/api/properties', propertiesRouter);

const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});