const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product' , {
        pageTitle : 'Add Product',
        path : '/admin/add-product',
        activeAddProduct : true,
        formsCSS: true,
        productCSS: true,
        editing : false
    });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(title , imageUrl, description, price);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
       return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if(!product) {
           return res.redirect('/');
        }
        res.render('admin/edit-product' , {
            pageTitle : 'Edit Product',
            path : '/admin/add-product',
            editing : editMode,
            product : product
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log("products, " + JSON.stringify(products));
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products && products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
}