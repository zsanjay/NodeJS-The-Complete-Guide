const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const PDFDocument = require('pdfkit');

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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  
});
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  
  });
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
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  
});
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId).then(order => {
        if(!order) {
          return next(new Error('No order found.'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()) {
          return next(new Error('Unauthorized'));
        }

        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoiceDir = path.join(__dirname, '..', 'data', 'invoices');
        const invoicePath = path.join(invoiceDir, invoiceName);

        if (!fs.existsSync(invoiceDir)) {
          fs.mkdirSync(invoicePath, { recursive: true }); // recursively creates nested folders
        }

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
           'inline; filename="'+ invoiceName +'"'
          );
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice', {
          underline: true
        });
        pdfDoc.text('---------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
          totalPrice += prod.quantity * prod.product.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.product.title +
                ' - ' +
                prod.quantity +
                ' x ' +
                '$' +
                prod.product.price
            );
        });
        pdfDoc.text('---');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
        pdfDoc.end();
        // fs.readFile(invoicePath, (err, data) => {
        //   if(err) {
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader('Content-Disposition', 'inline; filename="'+ invoiceName +'"');
        //   res.send(data);
        // });
        // const file = fs.createReadStream(invoicePath);
        // file.pipe(res);
      })
    .catch(err => next(err));
}