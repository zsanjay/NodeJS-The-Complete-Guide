const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');
const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('price').isFloat(),
      body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;

