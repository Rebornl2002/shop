const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const productController = require('../controller/productController');
const userController = require('../controller/userController');

router.get('/blogs', blogController.getAllBlogs);
router.get('/products', productController.getAllProducts);
router.post('/users/login', userController.checkUserLogin);
router.post('/users', userController.createUser);
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;
