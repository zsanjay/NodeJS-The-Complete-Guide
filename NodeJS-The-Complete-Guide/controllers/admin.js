const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const fileHelper = require('../util/file');
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product' , {
        pageTitle : 'Add Product',
        path : '/admin/add-product',
        activeAddProduct : true,
        formsCSS: true,
        productCSS: true,
        editing : false,
        errorMessage : null,
        validationErrors : [],
        hasError : false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const image = req.file;
    const errors = validationResult(req);

    if(!image) {
       return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: "Attached file is not an image!",
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        //_id: new mongoose.Types.ObjectId('68452b51ffc21ec548102e88'),
        title : title,
        price: price,
        description : description,
        imageUrl : 'images/' + image.filename,
        userId : req.user
    });
    product
    .save()
    .then(result => {
        // console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        // return res.status(500).render('admin/edit-product', {
        //     pageTitle: 'Add Product',
        //     path: '/admin/add-product',
        //     editing: false,
        //     hasError: true,
        //     product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         price: price,
        //         description: description
        //     },
        //     errorMessage: 'Database operation failed, please try again.',
        //     validationErrors: []
        // });
        //res.redirect('/500'); 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
    });
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
            path : '/admin/add-product',
            editing : editMode,
            product : product,
            hasError : false,
            errorMessage : null,
            validationErrors: []
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
    });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return next(new Error('Product not found.'));
            }
            const imagePath = path.join(rootDir, '..', product.imageUrl);
            fileHelper.deleteFile(imagePath);
            return Product.deleteOne({ _id : prodId, userId: req.user._id});
        })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.status(200).json({ message : "Success!" });
        })
        .catch(err => {
            res.status(500).json({ message : "Deleting product failed." });
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: true,
          hasError: true,
          product: {
            title: updatedTitle,
            price: updatedPrice,
            description: updatedDesc,
            _id: prodId
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if(image) {
            const imagePath = path.join(rootDir, '..', product.imageUrl);
            fileHelper.deleteFile(imagePath);
            product.imageUrl = 'images/' + image.filename
        }
        return product.save()
        .then(result => {
            console.log("UPDATED PRODUCT!");
            res.redirect('/admin/products');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);  
    });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
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