const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');

async function createUser(req, res) {
    try {
        await connectToDatabase();
        const { username, password } = req.body; // Sử dụng req.body để lấy thông tin từ body của yêu cầu POST
        // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu hay chưa
        const result = await sql.query`SELECT COUNT(*) AS count FROM users WHERE username = ${username}`;
        const userCount = result.recordset[0].count;

        if (userCount > 0) {
            // Username đã tồn tại trong cơ sở dữ liệu
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        } else {
            // Username chưa tồn tại trong cơ sở dữ liệu, tiến hành tạo dữ liệu mới
            // Sử dụng tham số để tránh SQL Injection
            const insertResult = await sql.query`
                INSERT INTO users (username, password)
                VALUES (${username}, ${password})
            `;

            if (insertResult.rowsAffected.length > 0) {
                // Dữ liệu đã được thêm thành công vào bảng users
                return res.status(201).json({ message: 'Đăng ký thành công' });
            } else {
                // Không thể thêm dữ liệu vào bảng users
                return res.status(500).json({ message: 'Không thể tạo dữ liệu' });
            }
        }
    } catch (err) {
        console.error('Lỗi khi tạo dữ liệu:', err);
        return res.status(500).json({ message: 'Lỗi khi tạo dữ liệu' });
    }
}

async function checkUserLogin(req, res) {
    const { username, password } = req.body; // Nhận dữ liệu từ frontend
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;

        if (result.recordset.length > 0) {
            // Tài khoản tồn tại trong cơ sở dữ liệu
            res.status(200).json({ message: 'Đăng nhập thành công!' });
        } else {
            // Tài khoản không tồn tại trong cơ sở dữ liệu
            res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        }
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }
}

module.exports = {
    createUser,
    checkUserLogin,
};
