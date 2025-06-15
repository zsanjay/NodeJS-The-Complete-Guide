const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/status');

const MONGODB_URI = 'mongodb://localhost:27017/feed?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000';

const app = express();

//app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
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

app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data  = error.data;
    res.status(status).json({ message: message, data : data });
});

mongoose.connect(
    MONGODB_URI
).then(result => {
    console.log("Connected!");
    const server = app.listen(8080);
    const io = require('./socket').init(server, {
        cors: {
          origin: "http://localhost:3000", // your client origin
          methods: ["GET", "POST"]
        }
    });
    io.on('connection', socket => {
        console.log('Client Connected');
    });
}).catch(err => {
    console.log(err);
}); 