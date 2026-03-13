const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Vitex Cafe API is running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
