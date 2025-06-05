const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then((result) => {
    res.render('shop/product-list', {
      prods: result.rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch((error) => console.log(error));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then((result) => {
    res.render('shop/index', {
      prods: result.rows,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch((error) => console.log(error));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if(cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products : cartProducts
      });
    })
  })
  
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    product = product.rows.length > 0 ? product.rows[0] : {}
    res.render('shop/product-detail', { 
      product : product,
      pageTitle : product.title,
      path : '/products'
    })
  }).catch((error) => console.log(error));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId , product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
}