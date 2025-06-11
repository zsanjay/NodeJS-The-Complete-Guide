// const http = require('http');
const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoutes = require('../routes/auth');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const bodyParser = require('body-parser');
const errorController = require('../controllers/error');
const User = require('../models/user');

const rootDir = require('../util/path');

const MONGODB_URI = 'mongodb://localhost:27017/shop?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000';

const app = express();
const store = new MongoDBStore({
    uri : MONGODB_URI,
    collection : 'sessions'
});

app.set('view engine', 'ejs');

app.set('views', path.join(rootDir, '..', 'views'));


// it will parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, '..', 'public'))); // To access the static files like css.
app.use(session({secret : 'my secret', resave: false, saveUninitialized: false, store : store}));

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
    })
      .catch(err => console.log(err));
});


app.use(shopRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes); // Parent route like @RequestMapping on Controller

// ../ is equal to ..
app.use(errorController.get404);

// Express internally does it for us.

// const server = http.createServer(app);
// server.listen(3000);

mongoose.connect(
    MONGODB_URI
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

