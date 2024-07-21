const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

async function getCartData(req, res) {
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

        // Truy vấn dữ liệu từ bảng cart và lấy thông tin sản phẩm từ bảng products
        const result = await sql.query`
            SELECT carts.maSP, carts.username, carts.quantity, products.name, products.price, products.imgSrc, products.percentDiscount
            FROM carts
            JOIN products ON carts.maSP = products.maSP
            WHERE carts.username = ${username}
        `;

        // Trả về dữ liệu từ bảng cart và thông tin sản phẩm trong phản hồi
        return res.status(200).json({ cartData: result.recordset });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn !' });
        }
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng cart!' });
    }
}

async function addToCart(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    const { maSP, quantity } = req.body;

    if (!maSP || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Kiểm tra sản phẩm có tồn tại trong bảng products không
        const productResult = await sql.query`SELECT * FROM products WHERE maSP = ${maSP}`;

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const cartCheckResult = await sql.query`
            SELECT * FROM carts WHERE username = ${username} AND maSP = ${maSP}
        `;

        if (cartCheckResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Sản phẩm đã được thêm trước đó!' });
        }

        // Thêm sản phẩm vào bảng cart
        const insertResult = await sql.query`
            INSERT INTO carts (username, maSP, quantity)
            VALUES (${username}, ${maSP}, ${quantity})
        `;

        if (insertResult.rowsAffected.length > 0) {
            return res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!' });
        } else {
            return res.status(500).json({ message: 'Không thể thêm sản phẩm vào giỏ hàng!' });
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng!' });
    }
}

async function updateCartQuantity(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    const { maSP, quantity } = req.body;

    if (!maSP || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Kiểm tra sản phẩm có tồn tại trong bảng products không
        const productResult = await sql.query`SELECT * FROM products WHERE maSP = ${maSP}`;

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updateResult = await sql.query`
            UPDATE carts
            SET quantity = ${quantity}
            WHERE username = ${username} AND maSP = ${maSP}
        `;

        if (updateResult.rowsAffected.length > 0) {
            return res.status(200).json({ message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công!' });
        } else {
            return res.status(500).json({ message: 'Không thể cập nhật số lượng sản phẩm trong giỏ hàng!' });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng!' });
    }
}

async function deleteCart(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token!' });
    }

    const { maSP } = req.body; // Giả sử maSP có thể là một chuỗi hoặc một mảng

    if (!maSP || (typeof maSP !== 'string' && !Array.isArray(maSP))) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Hàm để kiểm tra sự tồn tại của sản phẩm
        async function productExists(maSP) {
            const productResult = await sql.query`SELECT * FROM products WHERE maSP = ${maSP}`;
            return productResult.recordset.length > 0;
        }

        // Hàm để xóa sản phẩm khỏi giỏ hàng
        async function deleteProduct(maSP) {
            await sql.query`
                DELETE FROM carts WHERE username = ${username} AND maSP = ${maSP}
            `;
        }

        // Kiểm tra và xóa sản phẩm
        if (typeof maSP === 'string') {
            if (!(await productExists(maSP))) {
                return res.status(404).json({ message: `Sản phẩm với mã ${maSP} không tồn tại!` });
            }
            await deleteProduct(maSP);
        } else if (Array.isArray(maSP)) {
            for (const sp of maSP) {
                if (!(await productExists(sp))) {
                    return res.status(404).json({ message: `Sản phẩm với mã ${sp} không tồn tại!` });
                }
            }
            for (const sp of maSP) {
                await deleteProduct(sp);
            }
        }

        return res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng!' });
    }
}

module.exports = {
    addToCart,
    getCartData,
    updateCartQuantity,
    deleteCart,
};
