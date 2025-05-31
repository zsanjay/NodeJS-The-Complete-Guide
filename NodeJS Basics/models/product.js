const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const productFilePath = path.join(rootDir, '..', 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(productFilePath, (err, fileContent) => {
        if (err) {
            cb([]);
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(productFilePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callbackFn) {
        getProductsFromFile(callbackFn);
    }

    static findById(id, cb) {
      getProductsFromFile(products => {
        const product = products.find(p => p.id === id);
        cb(product);
      });
    }
}