// const http = require('http');
const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const fs = require('fs');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoutes = require('../routes/auth');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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

const csrfProtection = csrf();

const imageDir = path.join(rootDir, '..', 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        console.log("imageDir = ", imageDir);
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const safeDate = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${safeDate}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, '..', 'views'));

// it will parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(rootDir, '..', 'public'))); // To access the static files like css.
app.use('/images', express.static(path.join(rootDir, '..', 'images'))); // To access the static files like images.
app.use(session({secret : 'my secret', resave: false, saveUninitialized: false, store : store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy'); - For Synchronous Error
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        //throw new Error('Dummy');
        if(!user) {
          return next();
        }
        req.user = user;
        next();
    })
      .catch(err => {
        next(new Error(err)); // For Aysnc Error Handling
      });
});



app.use('/admin', adminRoutes); // Parent route like @RequestMapping on Controller
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
// ../ is equal to ..
app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.redirect('/500')
    console.log("unexpected error = ", error);
    res.status(500).render('500', {
        pageTitle : 'Error!',
        path: '/500',
        isAuthenticated : req.session?.isLoggedIn
    });
});

// Express internally does it for us.

// const server = http.createServer(app);
// server.listen(3000);

mongoose.connect(
    MONGODB_URI
).then(result => {
    console.log("Connected!");
    app.listen(3000);
}).catch(err => {
    console.log(err);
}); 

