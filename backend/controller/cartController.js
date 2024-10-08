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
           SELECT c.username,
                   c.id AS productId,
                   c.quantity,
                   c.variationId,
                   p.name,
                   p.percentDiscount,
                   pv.price,
                   pv.imgSrc,
                   pv.description,
                   pv.stock
            FROM carts c
            JOIN products p ON c.id = p.id
            JOIN productVariations pv ON c.variationId = pv.variationId
            WHERE c.username = ${username}
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

    const { id, quantity, variationId } = req.body;

    if (!id || !quantity || !variationId || quantity <= 0) {
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

        const variationProduct = await sql.query`SELECT * FROM productVariations WHERE variationId = ${variationId}`;

        if (variationProduct.recordset.length === 0) {
            return res.status(404).json({ message: 'Mẫu mã không tồn tại!' });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const cartCheckResult = await sql.query`
            SELECT * FROM carts WHERE username = ${username} AND id = ${id} AND variationId = ${variationId} 
        `;

        if (cartCheckResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Sản phẩm đã được thêm trước đó!' });
        }

        // Thêm sản phẩm vào bảng cart
        const insertResult = await sql.query`
            INSERT INTO carts (username, id, quantity, variationId)
            VALUES (${username}, ${id}, ${quantity}, ${variationId})
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

    const { productId, quantity, variationId } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username; // Lấy thông tin username từ token

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Kiểm tra sản phẩm có tồn tại trong bảng products không
        const productResult = await sql.query`SELECT * FROM products WHERE id = ${productId}`;

        if (productResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        const variationResult = await sql.query`SELECT * FROM productvariations WHERE variationId = ${variationId}`;

        if (variationResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Mẫu mã không tồn tại!' });
        }

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updateResult = await sql.query`
            UPDATE carts
            SET quantity = ${quantity}
            WHERE username = ${username} AND id = ${productId} AND variationId = ${variationId}
        `;

        if (updateResult.rowsAffected.length > 0) {
            return res.status(200).json({ message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công!' });
        } else {
            return res.status(500).json({ message: 'Không thể cập nhật số lượng sản phẩm trong giỏ hàng!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng!' });
    }
}

async function deleteCart(req, res) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Không có token!' });
    }

    const id = req.body; // Dữ liệu có thể là một mảng hoặc đối tượng
    console.log(id);

    // Kiểm tra dữ liệu đầu vào
    if (!id || typeof id !== 'object') {
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }

    // Chuyển đổi dữ liệu thành mảng nếu là một đối tượng
    const ids = Array.isArray(id) ? id : [id];

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const username = decoded.username;

        // Kết nối đến cơ sở dữ liệu
        await connectToDatabase();

        // Hàm để xóa sản phẩm khỏi giỏ hàng
        async function deleteProduct(productId, variationId) {
            await sql.query`
                DELETE FROM carts WHERE username = ${username} AND id = ${productId} AND variationId = ${variationId}
            `;
        }

        // Kiểm tra và xóa sản phẩm
        for (const { productId, variationId } of ids) {
            await deleteProduct(productId, variationId);
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
