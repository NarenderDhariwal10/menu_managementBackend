// config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    
    throw new Error('MONGO_URI missing');
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    
    throw err;
  }
};

module.exports = connectDB;
