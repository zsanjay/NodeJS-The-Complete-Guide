// const http = require('http');
const path = require('path');
const express = require('express');

const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');

const bodyParser = require('body-parser');

const rootDir = require('../util/path');

const app = express();

app.use((req, res, next) => {
    console.log('First Middleware!');
    next(); 
});

app.use((req, res, next) => {
    console.log('This always runs!');
    //res.send('<h1>Hello from Express!</h1>');
    next();
});

// it will parse the request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, '..', 'public'))); // To access the static files like css.

app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use(shopRoutes);
app.use('/admin', adminRoutes); // Parent route like @RequestMapping on Controller

// ../ is equal to ..
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, '..', 'views', '404.html'));
}) 

// Express internally does it for us.

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);

