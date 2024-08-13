const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

async function getCartData(req, res) {
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
            SELECT carts.id, carts.username, carts.quantity, products.name, products.price, products.imgSrc, products.percentDiscount
            FROM carts
            JOIN products ON carts.id = products.id
            WHERE carts.username = ${username}
        `;
        const products = result.recordset.map((product) => {
            // Chuyển đổi dữ liệu `imgSrc` thành base64
            const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
            return {
                ...product,
                imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
            };
        });

        // Trả về dữ liệu từ bảng cart và thông tin sản phẩm trong phản hồi
        return res.status(200).json(products);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn !' });
        }
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng cart!' });
    }
}

async function addToCart(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    const { id, quantity } = req.body;

    if (!id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Kiểm tra sản phẩm có tồn tại trong bảng products không
        const productResult = await sql.query`SELECT * FROM products WHERE id = ${id}`;

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const cartCheckResult = await sql.query`
            SELECT * FROM carts WHERE username = ${username} AND id = ${id}
        `;

        if (cartCheckResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Sản phẩm đã được thêm trước đó!' });
        }

        // Thêm sản phẩm vào bảng cart
        const insertResult = await sql.query`
            INSERT INTO carts (username, id, quantity)
            VALUES (${username}, ${id}, ${quantity})
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
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    const { id, quantity } = req.body;

    if (!id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Kiểm tra sản phẩm có tồn tại trong bảng products không
        const productResult = await sql.query`SELECT * FROM products WHERE id = ${id}`;

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updateResult = await sql.query`
            UPDATE carts
            SET quantity = ${quantity}
            WHERE username = ${username} AND id = ${id}
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
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Không có token!' });
    }

    const { id } = req.body; // Giả sử id có thể là một chuỗi hoặc một mảng

    if (!id || (typeof id !== 'number' && !Array.isArray(id))) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Hàm để kiểm tra sự tồn tại của sản phẩm
        async function productExists(id) {
            const productResult = await sql.query`SELECT * FROM products WHERE id = ${id}`;
            return productResult.recordset.length > 0;
        }

        // Hàm để xóa sản phẩm khỏi giỏ hàng
        async function deleteProduct(id) {
            await sql.query`
                DELETE FROM carts WHERE username = ${username} AND id = ${id}
            `;
        }

        // Kiểm tra và xóa sản phẩm
        if (typeof id === 'number') {
            if (!(await productExists(id))) {
                return res.status(404).json({ message: `Sản phẩm với mã ${id} không tồn tại!` });
            }
            await deleteProduct(id);
        } else if (Array.isArray(id)) {
            for (const sp of id) {
                if (!(await productExists(sp))) {
                    return res.status(404).json({ message: `Sản phẩm với mã ${sp} không tồn tại!` });
                }
            }
            for (const sp of id) {
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
