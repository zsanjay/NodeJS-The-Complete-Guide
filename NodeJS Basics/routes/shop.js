const path = require('path');

const express = require('express');
const rootDir = require('../util/path');

const router = express.Router();

// Http Method like Get, Post etc uses exact match
router.get('/', (req, res, next) => {
    //res.send('<h1>Hello from Shop!</h1>');
    res.sendFile(path.join(rootDir, '..', 'views', 'shop.html'));
});

module.exports = router;