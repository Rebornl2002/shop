const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const creditController = require('../controller/creditController');

router.get('/blogs', blogController.getAllBlogs);
router.get('/products', productController.getAllProducts);
router.get('/carts', cartController.getCartData);
router.get('/products/search', productController.getSearchProducts);
router.get('/products/details', productController.getDetailProduct);
router.get('/detailUser', userController.getDetailUser);
router.get('/products/discount', productController.getDiscountProducts);
router.get('/status', userController.status);
router.get('/allDetailProducts', productController.getAllDetailProducts);
router.get('/allDetailUsers', userController.getAllDetailUsers);
router.get('/credit', creditController.getCreditData);
router.get('/orders', orderController.getAllOrders);
router.get('/variations', productController.getVariationProduct);

router.post('/users/login', userController.checkUserLogin);
router.post('/users', userController.createUser);
router.post('/carts', cartController.addToCart);
router.post('/logout', userController.logout);
router.post('/products', productController.addProduct);
router.post('/order', orderController.addOrder);
router.post('/credit', creditController.addCreditCard);
router.post('/variations', productController.addVariationProduct);

router.put('/updateDetailUser', userController.updateDetailUser);
router.patch('/updateCartQuantity', cartController.updateCartQuantity);
router.patch('/updateProduct', productController.updateProduct);
router.patch('/toggerStatus', userController.toggleUserStatus);

router.patch('/product', productController.deleteProduct);

router.delete('/blogs/:id', blogController.deleteBlog);
router.delete('/carts', cartController.deleteCart);
router.delete('/variations', productController.deleteVariationProduct);

module.exports = router;
