const express = require('express');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// API Hello World
router.get('/hello', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Hello World from Node.js Express API!',
        user: req.user
    });
});

module.exports = router;