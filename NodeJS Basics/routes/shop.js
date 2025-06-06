const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

// Http Method like Get, Post etc uses exact match
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
//router.get('/products/delete');
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);


module.exports = router;