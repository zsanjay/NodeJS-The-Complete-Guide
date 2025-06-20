const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// // Http Method like Get, Post etc uses exact match
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
// //router.get('/products/delete');
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart); 
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.get('/checkout', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;