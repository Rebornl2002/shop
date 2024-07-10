const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

async function createUser(req, res) {
    try {
        await connectToDatabase();
        const { username, password } = req.body;

        // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu hay chưa
        const result = await sql.query`SELECT COUNT(*) AS count FROM users WHERE username = ${username}`;
        const userCount = result.recordset[0].count;

        if (userCount > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        } else {
            // Bắt đầu giao dịch
            const transaction = new sql.Transaction();
            await transaction.begin();

            try {
                // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                const hashedPassword = await bcrypt.hash(password, 10);

                // Sử dụng tham số để tránh SQL Injection
                const insertUser = await transaction.request().query`
                    INSERT INTO users (username, password)
                    VALUES (${username}, ${hashedPassword})
                `;

                // Chèn dữ liệu vào bảng detailUser
                const insertDetailUser = await transaction.request().query`
                    INSERT INTO detailUser (username)
                    VALUES (${username})
                `;

                // Nếu cả hai truy vấn đều thành công, commit giao dịch
                await transaction.commit();

                return res.status(201).json({ message: 'Đăng ký thành công' });
            } catch (err) {
                // Nếu có lỗi, rollback giao dịch
                await transaction.rollback();
                console.error('Lỗi khi tạo dữ liệu:', err);
                return res.status(500).json({ message: 'Lỗi khi tạo dữ liệu' });
            }
        }
    } catch (err) {
        console.error('Lỗi khi tạo dữ liệu:', err);
        return res.status(500).json({ message: 'Lỗi khi tạo dữ liệu' });
    }
}

async function checkUserLogin(req, res) {
    const { username, password } = req.body;
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM users WHERE username = ${username}`;

        if (result.recordset.length > 0) {
            // So sánh mật khẩu đã được mã hóa với mật khẩu nhập vào
            const match = await bcrypt.compare(password, result.recordset[0].password);
            if (match) {
                // Tạo token JWT với payload chứa thông tin username
                const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

                // Gửi về token trong phản hồi
                return res.status(200).json({ message: 'Đăng nhập thành công!', token });
            } else {
                return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
            }
        } else {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        }
    } catch (err) {
        console.error('Database connection failed:', err);
        return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }
}

async function getDetailUser(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        const result = await sql.query`
            SELECT *
            FROM detailUser
            WHERE username = ${username}
        `;

        return res.json(result.recordset);
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng detailUser!' });
    }
}

async function updateDetailUser(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Lấy dữ liệu cần cập nhật từ body của request
        let { fullName, email, phone, sex, date, address } = req.body;

        // Kiểm tra và đặt giá trị null nếu là chuỗi rỗng
        fullName = fullName === '' ? null : fullName;
        email = email === '' ? null : email;
        phone = phone === '' ? null : phone;
        sex = sex === '' ? null : sex;
        date = date === '' ? null : date;
        address = address === '' ? null : address;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Cập nhật dữ liệu trong bảng detailUser
        const result = await sql.query`
            UPDATE detailUser
            SET 
                fullName = ${fullName}, 
                email = ${email}, 
                phone = ${phone}, 
                sex = ${sex}, 
                date = ${date}, 
                address = ${address}
            WHERE username = ${username}
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        return res.json({ message: 'Cập nhật thông tin người dùng thành công!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi cập nhật dữ liệu trong bảng userDetail!' });
    }
}

module.exports = {
    createUser,
    checkUserLogin,
    getDetailUser,
    updateDetailUser,
};
