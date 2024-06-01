const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'LAPTOP-OJEFMQPQ\\SQLEXPRESS',
    database: 'shopdtb',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

let connectionPool;

async function connectToDatabase() {
    if (!connectionPool) {
        connectionPool = await sql.connect(config);
    }
}

async function closeDatabaseConnection() {
    if (connectionPool) {
        await connectionPool.close();
        connectionPool = null;
    }
}

async function getAllBlogs(req, res) {
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM blog`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

async function deleteData(req, res) {
    try {
        await connectToDatabase();
        const id = req.params.id; // Assuming you pass the id as a parameter
        // Execute the delete query using the id
        res.send(`Deleted blog with id ${id}`);
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
    }
}

async function createData(req, res) {
    try {
        await connectToDatabase();
        const newData = req.body; // Assuming you pass the data in the request body
        // Execute the insert query with the new data
        res.send('Data created successfully');
    } catch (err) {
        console.error('Error creating data:', err);
        res.status(500).send('Error creating data');
    }
}

// product 

async function getAllProduct(req, res) {
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM product`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

module.exports = {
    getAllBlogs,
    getAllProduct,
    deleteData,
    createData,
    closeDatabaseConnection // Thêm hàm này vào để có thể đóng kết nối đến cơ sở dữ liệu khi cần
};
