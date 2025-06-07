const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('../controllers/error');
const { mongoConnect } = require('../util/database');
const User = require('../models/user');

const rootDir = require('../util/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, '..', 'views'));

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');

// it will parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, '..', 'public'))); // To access the static files like css.


app.use((req, res, next) => {
    User.findById("684423b427b9f6e9c7bc75ee")
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); // Parent route like @RequestMapping on Controller
app.use(shopRoutes);

// ../ is equal to ..
app.use(errorController.get404);

mongoConnect((client) => {
    app.listen(3000);
})

