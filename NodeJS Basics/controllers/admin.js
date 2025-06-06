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
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price : price
    })
    .then(result => {
        console.log(result);
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
       return res.redirect('/');
    }
    const prodId = req.params.productId;
    //Product.findByPk(prodId)
    req.user.getProducts({ where : { id : prodId}})
    .then(product => {
        if(!product) {
           return res.redirect('/');
        }
        res.render('admin/edit-product' , {
            pageTitle : 'Edit Product',
            path : '/admin/add-product',
            editing : editMode,
            product : product[0]
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findByPk(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    })
    .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
    
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    .then((products) => {
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