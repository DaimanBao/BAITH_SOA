const pool = require('../config/db');

// GET /products - Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY id ASC'
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách sản phẩm'
        });
    }
};

// GET /products/:id - Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin sản phẩm'
        });
    }
};

// POST /products - Thêm sản phẩm
const createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            name.length > 255 ||
            typeof price !== 'number' ||
            !Number.isFinite(price) ||
            price < 0 ||
            typeof quantity !== 'number' ||
            !Number.isSafeInteger(quantity) ||
            quantity < 0
        ) {
            return res.status(400).json({
                message: 'Thông tin sản phẩm không hợp lệ'
            });
        }

        const result = await pool.query(
            `INSERT INTO products (name, description, price, quantity)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name.trim(), description ?? null, price, quantity]
        );

        res.status(201).json({
            message: 'Thêm sản phẩm thành công',
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi thêm sản phẩm'
        });
    }
};

// PUT /products/:id - Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            name.length > 255 ||
            typeof price !== 'number' ||
            !Number.isFinite(price) ||
            price < 0 ||
            typeof quantity !== 'number' ||
            !Number.isSafeInteger(quantity) ||
            quantity < 0
        ) {
            return res.status(400).json({
                message: 'Thông tin sản phẩm không hợp lệ'
            });
        }

        const result = await pool.query(
            `UPDATE products
             SET name = $1,
                 description = $2,
                 price = $3,
                 quantity = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [name.trim(), description ?? null, price, quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            message: 'Cập nhật sản phẩm thành công',
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi cập nhật sản phẩm'
        });
    }
};

// DELETE /products/:id - Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: 'ID sản phẩm không hợp lệ'
            });
        }

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            message: 'Xóa sản phẩm thành công',
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Lỗi khi xóa sản phẩm'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};