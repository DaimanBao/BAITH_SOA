const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const authenticateToken = require('./middleware/authMiddleware');
const productRoutes = require('./routes/productRoutes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API kiểm tra trạng thái service và database
app.get('/', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.status(200).json({
            message: 'Product Service is running!',
            database: 'Connected'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Database connection failed'
        });
    }
});

// Đăng ký Middleware bảo vệ toàn bộ Product Router
app.use('/products', authenticateToken, productRoutes);

app.listen(PORT, () => {
    console.log(
        `Product Service đang chạy tại http://localhost:${PORT}`
    );
});