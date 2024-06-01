// Trong dataRouter.js
const express = require('express');
const router = express.Router();
const { getAllBlogs, createData,deleteData, getAllProduct } = require('../queries');

router.get('/blog', getAllBlogs);
router.get('/product',getAllProduct);
router.delete('/:id', deleteData); // Assuming you pass the id as a parameter
router.post('/', createData);

module.exports = router;
