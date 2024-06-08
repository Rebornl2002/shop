const sql = require('mssql/msnodesqlv8');
const { connectToDatabase } = require('./database');

async function getAllBlogs(req, res) {
    try {
        await connectToDatabase();
        const result = await sql.query`SELECT * FROM blogs`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Database connection failed:', err);
        res.status(500).send('Database connection failed');
    }
}

async function deleteBlog(req, res) {
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

module.exports = {
    getAllBlogs,
    deleteBlog,
};
