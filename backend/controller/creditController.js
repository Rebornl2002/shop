const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

async function addCreditCard(req, res) {
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

        // Nhận dữ liệu từ req.body
        const { cardHolder, cardNumber, cvv, expiryDate, postalCode } = req.body;

        if (!cardHolder || !cardNumber || !cvv || !expiryDate || !postalCode) {
            return res.status(400).json({ message: 'Thông tin thẻ tín dụng không hợp lệ!' });
        }

        // Kiểm tra sự tồn tại của cặp cardNumber và username
        const result = await sql.query`
            SELECT COUNT(*) AS count FROM creditCard WHERE cardNumber = ${cardNumber} AND username = ${username}
        `;
        if (result.recordset[0].count > 0) {
            return res.status(400).json({ message: 'Thẻ tín dụng đã tồn tại!' });
        }

        // Thêm thẻ tín dụng vào bảng creditCard
        await sql.query`
            INSERT INTO creditCard (cardHolder, cardNumber, cvv, expiryDate, postalCode, username)
            VALUES (${cardHolder}, ${cardNumber}, ${cvv}, ${expiryDate}, ${postalCode}, ${username})
        `;

        return res.status(201).json({ message: 'Thêm thẻ tín dụng thành công!' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error('Lỗi khi thêm thẻ tín dụng:', error);
        return res.status(500).json({ message: 'Lỗi khi thêm thẻ tín dụng!' });
    }
}

async function getCreditData(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Truy vấn dữ liệu từ bảng cart và lấy thông tin sản phẩm từ bảng products
        const result = await sql.query`
            SELECT *
            FROM creditCard
            WHERE creditCard.username = ${username}
        `;

        // Trả về dữ liệu từ bảng cart và thông tin sản phẩm trong phản hồi
        return res.status(200).json(result.recordset);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn !' });
        }
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng cart!' });
    }
}

module.exports = { addCreditCard, getCreditData };
