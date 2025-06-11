const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      csrfToken: req.csrfToken()
    });
  });
};

exports.getCart = (req, res, next) => {
  const cartItems = populateCartItems(req);
  cartItems.then(user => {
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products : products
    });
  })
  .catch(err => console.log(err));
};

 const populateCartItems =  async (req) => {
 return  await req.user.populate('cart.items.productId');
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then((product) => {
    return req.user.addToCart(product);
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  })
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId' : req.user._id })
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', { 
      product : product,
      pageTitle : product.title,
      path : '/products'
    });
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    }) 
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const cartItems = populateCartItems(req);
  cartItems.then(user => {
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const order = new Order({
      user: {
        email : req.user.email,
        userId: req.user
      },
      products: products
    });
    return order.save();
  }).then(result => {
    return req.user.clearCart();
  }).then(() => {
    res.redirect('/orders');
  })
    .catch(err => console.log(err));
};
