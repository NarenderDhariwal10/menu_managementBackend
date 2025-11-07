// index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');

const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// health route (works even if DB fails to connect)
app.get('/health', (req, res) => res.status(200).send('Menu Backend is healthy'));

// normal routes (they can still be mounted even if DB not connected)
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => res.send('Menu Backend is running'));

// global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    // start server only after DB connected (option)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} `);
    });
  } catch (err) {
    console.error('DB connect failed — not starting server. Error:', err.message || err);
    process.exit(1); // optional: stop the process so you know to fix DB
  }
})();
