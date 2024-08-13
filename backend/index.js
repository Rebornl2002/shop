const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dataRouter = require('./routers/dataRouter');

const app = express();
const port = 4000;

// Cấu hình CORS
app.use(
    cors({
        origin: 'http://localhost:3000', // Cho phép nguồn gốc từ địa chỉ này
        credentials: true, // Cho phép gửi cookie và thông tin xác thực
    }),
);

// Cấu hình body-parser tích hợp
app.use(express.json({ limit: '10mb' })); // Cấu hình cho JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Cấu hình cho URL-encoded

// Cấu hình cookie-parser
app.use(cookieParser());

// Đăng ký các router
app.use('/api/data', dataRouter);

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
