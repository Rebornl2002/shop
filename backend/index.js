// Trong app.js
const express = require('express');
const cors = require('cors');
const dataRouter = require('./routers/dataRouter');

const app = express();
const port = 4000;

app.use(cors());
app.use('/api/data', dataRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
