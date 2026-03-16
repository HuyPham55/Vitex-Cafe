const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const variantRoutes = require('./routes/variantRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const asmrRoutes = require('./routes/asmrRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/asmr', asmrRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Vitex Cafe API is running');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
