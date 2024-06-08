const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'LAPTOP-OJEFMQPQ\\SQLEXPRESS',
    database: 'shopdtb',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
    },
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

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
};
