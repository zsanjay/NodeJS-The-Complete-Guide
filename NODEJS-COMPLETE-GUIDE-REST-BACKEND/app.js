const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const { clearImage } = require('./util/file'); 

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

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
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
    if(!req.isAuth) {
        throw new Error('Not authenticated!');
    }
    if(!req.file) {
        return res.status(200).json({ message : 'No file provided!' });
    }
    if(req.body.oldPath) {
        clearImage(req.body.oldPath);
    }
    return res.status(201).json({ message : 'File stored.', filePath : req.file.path});
});

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
        if(!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message : message, status : code, data : data};
    }
})
);

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
    app.listen(8080);
}).catch(err => {
    console.log(err);
}); 

