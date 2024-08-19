const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

async function createUser(req, res) {
    try {
        await connectToDatabase();
        const { username, password, role = 'user' } = req.body;

        // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu hay chưa
        const result = await sql.query`SELECT COUNT(*) AS count FROM users WHERE username = ${username}`;
        const userCount = result.recordset[0].count;

        if (userCount > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        } else {
            if (role === 'admin') {
                const token = req.cookies.authToken;
                const decoded = jwt.verify(token, secretKey);
                const decodedRole = decoded.role;
                if (!token) {
                    return res.status(401).json({ message: 'Token không hợp lệ!' });
                }

                if (decodedRole !== 'superAdmin') {
                    return res.status(403).json({ message: 'Không có quyền thêm tài khoản' });
                }
            }
            // Bắt đầu giao dịch
            const transaction = new sql.Transaction();
            await transaction.begin();

            try {
                // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                const hashedPassword = await bcrypt.hash(password, 10);

                // Sử dụng tham số để tránh SQL Injection
                const insertUser = await transaction.request().query`
                    INSERT INTO users (username, password, role)
                    VALUES (${username}, ${hashedPassword}, ${role})
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

    // Xác thực đầu vào
    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tên người dùng và mật khẩu!' });
    }

    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM users WHERE username = ${username}`;

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            if (user.status === 'disabled') {
                return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa!' });
            }

            // So sánh mật khẩu đã được mã hóa với mật khẩu nhập vào
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Tạo token JWT với payload chứa thông tin username và vai trò
                const token = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });

                // Thiết lập cookie với token
                res.cookie('authToken', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Chỉ bật secure khi ở môi trường sản xuất
                    sameSite: 'Strict',
                    maxAge: 3600000, // 1 giờ
                    path: '/',
                });

                res.cookie('role', user.role, {
                    httpOnly: false, // Cookie này có thể được truy cập từ JavaScript
                    secure: process.env.NODE_ENV === 'production', // Chỉ bật secure khi ở môi trường sản xuất
                    sameSite: 'Strict',
                    maxAge: 3600000, // 1 giờ
                    path: '/',
                });

                // Gửi về thông tin vai trò trong phản hồi
                return res.status(200).json({ message: 'Đăng nhập thành công!' });
            } else {
                return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
            }
        } else {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        }
    } catch (err) {
        console.error('Lỗi kết nối cơ sở dữ liệu:', err);
        return res.status(500).json({ message: 'Lỗi kết nối cơ sở dữ liệu!' });
    }
}

// Hàm đăng xuất
async function logout(req, res) {
    res.clearCookie('authToken', {
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Đảm bảo cookie được xóa với cùng cấu hình secure
        sameSite: 'Strict', // Đảm bảo sameSite khớp với khi thiết lập cookie
    });
    res.clearCookie('role', {
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Đảm bảo cookie được xóa với cùng cấu hình secure
        sameSite: 'Strict', // Đảm bảo sameSite khớp với khi thiết lập cookie
    });
    res.status(200).send({ message: 'Logged out' });
}

// Hàm kiểm tra trạng thái đăng nhập
async function status(req, res) {
    const authToken = req.cookies.authToken;
    if (authToken) {
        try {
            jwt.verify(authToken, secretKey);
            res.status(200).send({ loggedIn: true });
        } catch (err) {
            res.status(200).send({ loggedIn: false });
        }
    } else {
        res.status(200).send({ loggedIn: false });
    }
}

async function getDetailUser(req, res) {
    const token = req.cookies.authToken; // Lấy token từ cookies

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
    const token = req.cookies.authToken; // Lấy token từ cookies

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

async function getAllDetailUsers(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const role = decoded.role;

        if (role === 'admin' || role === 'superAdmin') {
            // Kết nối đến cơ sở dữ liệu
            await connectToDatabase();

            // Truy vấn dữ liệu từ bảng products và detailProducts với alias và ký tự đại diện
            const result = await sql.query`
            SELECT 
                du.*,     
                u.status   
            FROM 
                dbo.detailUser AS du
            JOIN 
                dbo.users AS u ON du.username = u.username
        `;

            // Trả về dữ liệu từ bảng products và detailProducts trong phản hồi
            return res.status(200).json(result.recordset);
        } else {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng detailUser!' });
    }
}

async function toggleUserStatus(req, res) {
    const token = req.cookies.authToken;
    const { username } = req.body; // Lấy username từ req.body, giả định bạn gửi thông qua body

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    if (!username) {
        return res.status(400).json({ message: 'Tên người dùng không được cung cấp!' });
    }

    try {
        // Xác thực token và lấy thông tin của tài khoản đang thực hiện hành động
        const decoded = jwt.verify(token, secretKey);
        const role = decoded.role;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Lấy trạng thái hiện tại của người dùng
        const userResult = await sql.query`
            SELECT status, role FROM users WHERE username = ${username}`;

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        const user = userResult.recordset[0];
        const currentStatus = user.status;
        const userRole = user.role;

        // Kiểm tra quyền của tài khoản thực hiện
        if (userRole === 'admin' && role !== 'superAdmin') {
            return res.status(403).json({ message: 'Bạn không có quyền vô hiệu hóa tài khoản này !' });
        } else if (userRole === 'superAdmin') {
            return res.status(403).json({ message: 'Không thể vô hiệu hóa superAdmin !' });
        }

        // Xác định trạng thái mới
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';

        // Cập nhật trạng thái người dùng
        const result = await sql.query`
            UPDATE users
            SET status = ${newStatus}
            WHERE username = ${username}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        return res.status(200).json({ message: `Tài khoản đã được chuyển sang trạng thái ${newStatus}.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái tài khoản!' });
    }
}

module.exports = {
    createUser,
    checkUserLogin,
    getDetailUser,
    updateDetailUser,
    logout,
    status,
    getAllDetailUsers,
    toggleUserStatus,
};
