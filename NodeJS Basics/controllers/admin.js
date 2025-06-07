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
    const product = new Product(title, price, description, imageUrl, null , req.user._id);
    product
    .save()
    .then(result => {
        console.log('Created Product');
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
    Product.findById(prodId)
    .then(product => {
        if(!product) {
           return res.redirect('/');
        }
        res.render('admin/edit-product' , {
            pageTitle : 'Edit Product',
            path : '/admin/edit-product',
            editing : editMode,
            product : product
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
    .then(() => {
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
    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
    product.save()
    .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
    
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then((products) => {
        if (!products) {
            return res.status(404).send('Product not found'); // ✅ return prevents further execution
        }
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProducts: products && products.length > 0,
            activeShop: true,
            productCSS: true
        });
    })
    .catch(err => console.log(err));
}