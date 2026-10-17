const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;

// API đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userName || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập username và password'
            });
        }

        // Tìm user trong PostgreSQL
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [userName]
        );

        // Không tìm thấy user
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Username hoặc password không đúng'
            });
        }

        const user = result.rows[0];

        // Kiểm tra password
        if (password !== user.password) {
            return res.status(401).json({
                message: 'Username hoặc password không đúng'
            });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                idUser: user.id_user,
                userName: user.username
            },
            SECRET_KEY,
            {
                expiresIn: '1h'
            }
        );

        // Lưu token vào database
        await pool.query(
            'UPDATE users SET token = $1 WHERE id_user = $2',
            [token, user.id_user]
        );

        res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Lỗi server'
        });
    }
});

// API xác thực token
router.get('/auth', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Token hợp lệ',
        user: req.user
    });
});

module.exports = router;