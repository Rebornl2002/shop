const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');

router.get('/blogs', blogController.getAllBlogs);
router.get('/products', productController.getAllProducts);
router.get('/carts', cartController.getCartData);
router.get('/products/search', productController.getSearchProducts);
router.get('/products/details', productController.getDetailProduct);
router.get('/detailUser', userController.getDetailUser);
router.get('/products/discount', productController.getDiscountProducts);

router.post('/users/login', userController.checkUserLogin);
router.post('/users', userController.createUser);
router.post('/carts', cartController.addToCart);

router.put('/updateDetailUser', userController.updateDetailUser);
router.put('/updateCartQuantity', cartController.updateCartQuantity);

router.delete('/blogs/:id', blogController.deleteBlog);
router.delete('/carts', cartController.deleteCart);

module.exports = router;
