// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

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

app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next(); // Allows the request to continue to the next middleware in line
});

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
})

app.use('/', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

// Express internally does it for us.

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);

