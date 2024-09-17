const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js
const crypto = require('crypto');

// Hàm để tạo orderCode ngẫu nhiên
function generateRandomOrderCode(length = 10) {
    return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

async function addOrder(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Bắt đầu giao dịch
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            // Tạo orderCode ngẫu nhiên và kiểm tra tính hợp lệ
            let orderCode;
            let orderExists = true;
            while (orderExists) {
                orderCode = generateRandomOrderCode();
                const result = await transaction.request().query`
                    SELECT COUNT(*) AS count FROM orders WHERE orderCode = ${orderCode}
                `;
                orderExists = result.recordset[0].count > 0;
            }

            // Nhận dữ liệu từ req.body
            const { order, products } = req.body;

            if (!order || !products || products.length === 0) {
                throw new Error('Dữ liệu đơn hàng hoặc sản phẩm không hợp lệ!');
            }

            const { name, phone, address, totalPrice, paymentMethod, cardNumber } = order;

            // Thêm đơn hàng vào bảng orders
            await transaction.request().query`
                INSERT INTO orders (orderCode, name, phone, address, totalPrice, paymentMethod, username, cardNumber)
                VALUES (${orderCode}, ${name}, ${phone}, ${address}, ${totalPrice}, ${paymentMethod} , ${username}, ${cardNumber})
            `;

            // Thêm chi tiết sản phẩm vào bảng detailOrders
            for (const product of products) {
                const { id, quantity } = product;
                if (!id || quantity <= 0) {
                    throw new Error('Thông tin sản phẩm không hợp lệ!');
                }

                await transaction.request().query`
                    INSERT INTO detailOrders (orderCode, productID, quantity)
                    VALUES (${orderCode}, ${id}, ${quantity})
                `;

                await transaction.request().query`
                    UPDATE detailProducts
                    SET quantityInStock = quantityInStock - ${quantity}
                    WHERE id = ${id}
                `;

                await transaction.request().query`
                    DELETE FROM carts WHERE username = ${username} AND id = ${id}
                `;
            }

            // Commit giao dịch nếu mọi thứ thành công
            await transaction.commit();
            return res.status(201).json({ message: 'Đơn hàng đã được thêm thành công!' });
        } catch (error) {
            // Rollback giao dịch nếu có lỗi
            await transaction.rollback();
            console.error('Lỗi khi thêm đơn hàng:', error);
            return res.status(500).json({ message: 'Lỗi khi thêm đơn hàng!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        return res.status(500).json({ message: 'Lỗi khi xác thực token!' });
    }
}

async function getAllOrders(req, res) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const role = decoded.role;

        if (role === 'admin' || role === 'superAdmin') {
            await connectToDatabase();

            const result = await sql.query`
                SELECT 
                    o.*,
                    ISNULL(
                        STRING_AGG(CONCAT(d.productID, ' - ', p.name, ' (', d.quantity, ')'), ', '),
                        'No Products'
                    ) AS purchasedProducts
                FROM orders o
                LEFT JOIN detailOrders d ON o.orderCode = d.orderCode
                LEFT JOIN products p ON d.productID = p.id
                GROUP BY 
                    o.orderCode, 
                    o.name, 
                    o.phone, 
                    o.address, 
                    o.totalPrice, 
                    o.paymentMethod, 
                    o.username, 
                    o.cardNumber, 
                    o.purchaseDate
            `;

            return res.status(200).json(result.recordset);
        } else {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi xác thực token!' });
    }
}

module.exports = { addOrder, getAllOrders };
