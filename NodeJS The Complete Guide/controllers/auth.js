const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const cookies = req.get('Cookie').split("; ");
  // const isAuthenticated = cookies[cookies.length - 1].split("=")[1];
  // console.log(isAuthenticated);
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated : req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  //res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
  User.findById('684537e95373a9ae8d8a5ab3')
      .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}