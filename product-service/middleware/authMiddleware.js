const authenticateToken = async (req, res, next) => {
    try {
        // Lấy Authorization từ request của Client
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Chưa cung cấp token'
            });
        }

        // Kiểm tra định dạng Bearer Token
        if (!/^Bearer \S+$/i.test(authHeader)) {
            return res.status(401).json({
                message: 'Token không đúng định dạng Bearer'
            });
        }

        // Gọi Auth Service (Bài 2) để xác thực
        const response = await fetch(
            `${process.env.AUTH_SERVICE_URL}/api/auth`,
            {
                method: 'GET',
                headers: {
                    Authorization: authHeader
                },
                signal: AbortSignal.timeout(5000)
            }
        );

        // Token không hợp lệ
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return res.status(response.status).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }

            return res.status(502).json({
                message: 'Auth Service xác thực thất bại'
            });
        }

        const data = await response.json();

        // Lưu thông tin người dùng vào request
        req.user = data.user;

        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error.message);

        return res.status(503).json({
            message: 'Không thể kết nối đến Auth Service'
        });
    }
};

module.exports = authenticateToken;