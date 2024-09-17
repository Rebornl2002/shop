const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); // Sử dụng secretKey từ config.js

const toNullIfEmpty = (value) => {
    return value === undefined || value === '' ? null : value;
};

async function getAllProducts(req, res) {
    try {
        await connectToDatabase();

        // Nhận tham số `page` và `limit` từ query string (nếu không có thì đặt mặc định)
        const page = parseInt(req.query.page, 10) || 1; // Trang hiện tại (mặc định là trang 1)
        const limit = parseInt(req.query.limit, 10) || 4; // Số lượng sản phẩm mỗi trang (mặc định là 10)

        // Tính toán vị trí bắt đầu (offset)
        const offset = (page - 1) * limit;

        // Truy vấn để lấy dữ liệu sản phẩm theo trang và giới hạn
        const result = await sql.query`
            SELECT * FROM products
            ORDER BY id
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
        `;

        // Xử lý dữ liệu để chuyển đổi trường `imgSrc` thành base64
        const products = result.recordset.map((product) => {
            const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
            return {
                ...product,
                imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
            };
        });

        // Trả về dữ liệu cho client bao gồm cả thông tin về trang hiện tại và số lượng sản phẩm mỗi trang
        res.json({
            page,
            limit,
            products,
        });
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

        // Xử lý dữ liệu để chuyển đổi trường `imgSrc` thành base64
        const products = result.recordset.map((product) => {
            // Chuyển đổi dữ liệu `imgSrc` thành base64
            const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
            return {
                ...product,
                imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
            };
        });

        // Trả về danh sách sản phẩm dưới dạng JSON
        res.json(products);
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

        // Xử lý dữ liệu để chuyển đổi trường `imgSrc` thành base64
        const products = result.recordset.map((product) => {
            // Chuyển đổi dữ liệu `imgSrc` thành base64
            const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
            return {
                ...product,
                imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
            };
        });

        res.json(products);
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
            SELECT 
                p.*, 
                d.trademark, 
                d.expiry, 
                d.quantityInStock, 
                d.origin
            FROM products p
            JOIN detailProducts d ON p.id = d.id
            WHERE d.id = ${id}   
        `;
        // SELECT dp.*, p.*
        //     FROM detailProducts dp
        //     JOIN products p ON dp.id = p.id
        //     WHERE dp.id = ${id}

        // Xử lý dữ liệu để chuyển đổi trường `imgSrc` thành base64
        const products = result.recordset.map((product) => {
            // Chuyển đổi dữ liệu `imgSrc` thành base64
            const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
            return {
                ...product,
                imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
            };
        });

        res.json(products);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

async function getAllDetailProducts(req, res) {
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

            // Truy vấn dữ liệu từ bảng products và detailProducts với alias và ký tự đại diệnP
            const result = await sql.query`
                SELECT 
                    p.*, 
                    d.trademark, 
                    d.expiry, 
                    d.quantityInStock, 
                    d.origin
                FROM products p
                JOIN detailProducts d ON p.id = d.id
            `;

            // Xử lý dữ liệu để chuyển đổi trường `imgSrc` thành base64
            const products = result.recordset.map((product) => {
                // Chuyển đổi dữ liệu `imgSrc` thành base64
                const base64ImgSrc = product.imgSrc ? product.imgSrc.toString('base64') : null;
                return {
                    ...product,
                    imgSrc: base64ImgSrc ? `data:image/png;base64,${base64ImgSrc}` : null,
                };
            });

            // Trả về dữ liệu từ bảng products và detailProducts trong phản hồi
            return res.status(200).json(products);
        } else {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu từ bảng products!' });
    }
}

async function addProduct(req, res) {
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

            // Bắt đầu giao dịch
            const transaction = new sql.Transaction();
            await transaction.begin();

            try {
                // Nhận dữ liệu sản phẩm từ req.body
                let { name, price, percentDiscount, origin, expiry, quantityInStock, imgSrc, trademark } = req.body;

                origin = toNullIfEmpty(origin);
                expiry = toNullIfEmpty(expiry);
                trademark = toNullIfEmpty(trademark);

                // Xử lý chuỗi base64
                let imgSrcBuffer;
                if (imgSrc.startsWith('data:image')) {
                    const base64Data = imgSrc.split(',')[1];
                    imgSrcBuffer = Buffer.from(base64Data, 'base64');
                } else {
                    imgSrcBuffer = Buffer.from(imgSrc, 'base64');
                }

                // Thêm sản phẩm mới vào bảng products và lấy ID
                const productResult = await transaction.request().query`
                    INSERT INTO products (name, price, percentDiscount, imgSrc)
                    OUTPUT inserted.id
                    VALUES (${name}, ${price}, ${percentDiscount}, ${imgSrcBuffer})
                `;

                const productId = productResult.recordset[0].id;

                // Thêm chi tiết sản phẩm vào bảng detailProducts với ID từ bảng products
                await transaction.request().query`
                    INSERT INTO detailProducts (id, origin, expiry, quantityInStock, trademark)
                    VALUES (${productId}, ${origin}, ${expiry}, ${quantityInStock}, ${trademark})
                `;

                // Commit giao dịch nếu mọi thứ thành công
                await transaction.commit();
                return res.status(201).json({ message: 'Sản phẩm đã được thêm thành công!' });
            } catch (error) {
                // Rollback giao dịch nếu có lỗi
                await transaction.rollback();
                console.error(error);
                return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm!' });
            }
        } else {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm!' });
    }
}

async function updateProduct(req, res) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' });
    }

    try {
        // Xác thực token JWT
        const decoded = jwt.verify(token, secretKey);
        const role = decoded.role;

        if (role !== 'admin' && role !== 'superAdmin') {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }

        await connectToDatabase();
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            const { id, ...fieldsToUpdate } = req.body;

            // Xây dựng câu truy vấn động
            const updateProductFields = [];
            const updateDetailProductFields = [];
            let imgSrcBuffer = null;

            if (fieldsToUpdate.name) updateProductFields.push('name = @name');
            if (fieldsToUpdate.price) updateProductFields.push('price = @price');
            if (fieldsToUpdate.percentDiscount) updateProductFields.push('percentDiscount = @percentDiscount');
            if (fieldsToUpdate.imgSrc) {
                const imgSrc = fieldsToUpdate.imgSrc;
                imgSrcBuffer = imgSrc.startsWith('data:image')
                    ? Buffer.from(imgSrc.split(',')[1], 'base64')
                    : Buffer.from(imgSrc, 'base64');
                updateProductFields.push('imgSrc = @imgSrc');
            }
            if (fieldsToUpdate.origin) updateDetailProductFields.push('origin = @origin');
            if (fieldsToUpdate.expiry) updateDetailProductFields.push('expiry = @expiry');
            if (fieldsToUpdate.quantityInStock) updateDetailProductFields.push('quantityInStock = @quantityInStock');
            if (fieldsToUpdate.trademark) updateDetailProductFields.push('trademark = @trademark');

            if (updateProductFields.length > 0) {
                const updateProductQuery = `UPDATE products SET ${updateProductFields.join(', ')} WHERE id = @id`;
                const request = transaction.request().input('id', sql.Int, id);
                if (fieldsToUpdate.name) request.input('name', sql.NVarChar, fieldsToUpdate.name);
                if (fieldsToUpdate.price) request.input('price', sql.NVarChar, fieldsToUpdate.price);
                if (fieldsToUpdate.percentDiscount)
                    request.input('percentDiscount', sql.NVarChar, fieldsToUpdate.percentDiscount);
                if (imgSrcBuffer) request.input('imgSrc', sql.VarBinary, imgSrcBuffer);
                await request.query(updateProductQuery);
            }

            if (updateDetailProductFields.length > 0) {
                const updateDetailProductQuery = `UPDATE detailProducts SET ${updateDetailProductFields.join(', ')} WHERE id = @id`;
                const request = transaction.request().input('id', sql.Int, id);
                if (fieldsToUpdate.origin) request.input('origin', sql.NVarChar, fieldsToUpdate.origin);
                if (fieldsToUpdate.expiry) request.input('expiry', sql.NVarChar, fieldsToUpdate.expiry);
                if (fieldsToUpdate.quantityInStock)
                    request.input('quantityInStock', sql.Int, fieldsToUpdate.quantityInStock);
                if (fieldsToUpdate.trademark) request.input('trademark', sql.NVarChar, fieldsToUpdate.trademark);
                await request.query(updateDetailProductQuery);
            }

            await transaction.commit();
            return res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công!' });
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi xác thực người dùng!' });
    }
}

async function deleteProduct(req, res) {
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

            // Bắt đầu giao dịch
            const transaction = new sql.Transaction();
            await transaction.begin();

            try {
                // Nhận id sản phẩm từ req.body
                const { id } = req.body;

                // Xóa sản phẩm khỏi bảng detailProducts trước
                await transaction.request().query`
                    DELETE FROM detailProducts WHERE id = ${id}
                `;

                // Xóa sản phẩm khỏi bảng products
                await transaction.request().query`
                    DELETE FROM products WHERE id = ${id}
                `;

                // Commit giao dịch nếu mọi thứ thành công
                await transaction.commit();
                return res.status(200).json({ message: 'Sản phẩm đã được xóa thành công!' });
            } catch (error) {
                // Rollback giao dịch nếu có lỗi
                await transaction.rollback();
                console.error(error);
                return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm!' });
            }
        } else {
            return res.status(403).json({ message: 'Không có quyền truy cập!' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm!' });
    }
}

module.exports = {
    getAllProducts,
    getSearchProducts,
    getDetailProduct,
    getDiscountProducts,
    getAllDetailProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};
