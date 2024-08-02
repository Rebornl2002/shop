const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');

async function getAllProducts(req, res) {
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM products`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

async function getDiscountProducts(req, res) {
    try {
        // Kết nối tới cơ sở dữ liệu
        await connectToDatabase();

        // Truy vấn để lấy 4 sản phẩm có giảm giá lớn nhất
        const result = await sql.query`SELECT TOP 4 * FROM products ORDER BY percentDiscount DESC`;

        // Trả về danh sách sản phẩm dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        // Ghi log lỗi
        console.error('Database connection failed:', err);

        // Trả về lỗi 500 với thông báo lỗi
        res.status(500).send('Database connection failed');
    }
}

async function getSearchProducts(req, res) {
    const { productName } = req.query; // Lấy tên sản phẩm từ query params
    try {
        await connectToDatabase();
        let result;

        if (productName) {
            // Nếu có tên sản phẩm được cung cấp, thực hiện truy vấn với điều kiện tìm kiếm
            const searchPattern = `%${productName}%`;
            result = await sql.query`
                SELECT *
                FROM products
                WHERE name LIKE ${searchPattern}
            `;
        } else {
            // Nếu không có tên sản phẩm được cung cấp, lấy tất cả sản phẩm
            result = await sql.query`SELECT * FROM products`;
        }

        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

async function getDetailProduct(req, res) {
    const { id } = req.query;
    try {
        await connectToDatabase();
        const result = await sql.query`
            SELECT dp.*, p.*
            FROM detailProducts dp
            JOIN products p ON dp.id = p.id
            WHERE dp.id = ${id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

module.exports = {
    getAllProducts,
    getSearchProducts,
    getDetailProduct,
    getDiscountProducts,
};
