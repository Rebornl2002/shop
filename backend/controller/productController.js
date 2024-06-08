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

module.exports = {
    getAllProducts,
};
