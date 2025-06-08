// const http = require('http');
const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const errorController = require('../controllers/error');
const User = require('../models/user');

const rootDir = require('../util/path');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(rootDir, '..', 'views'));


// it will parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, '..', 'public'))); // To access the static files like css.

app.use((req, res, next) => {
    User.findById('684537e95373a9ae8d8a5ab3')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

app.use(shopRoutes);
app.use('/admin', adminRoutes); // Parent route like @RequestMapping on Controller

// ../ is equal to ..
app.use(errorController.get404);

// Express internally does it for us.

// const server = http.createServer(app);
// server.listen(3000);

mongoose.connect(
    'mongodb://localhost:27017/shop?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000'
).then(result => {
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name: 'Sanjay',
                email: 'sanjay@test.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    console.log("Connected!");
    app.listen(3000);
}).catch(err => {
    console.log(err);
}); 

