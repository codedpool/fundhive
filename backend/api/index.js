const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('../src/routes/projects');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL }));



// Routes
app.use('/api', projectRoutes);

// MongoDB Connection (only connect if not already connected)
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Export the app for Vercel
module.exports = app;