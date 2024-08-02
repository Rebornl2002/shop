// Trong app.js
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const dataRouter = require('./routers/dataRouter');
const cookieParser = require('cookie-parser');

const app = express();
const port = 4000;

app.use(
    cors({
        origin: 'http://localhost:3000', // Cho phép nguồn gốc từ địa chỉ này
        credentials: true, // Cho phép gửi cookie và thông tin xác thực
    }),
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/data', dataRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
