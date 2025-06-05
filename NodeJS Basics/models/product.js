const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
    
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.query(
            'INSERT INTO "node-complete".products (title, price, imageurl, description) VALUES ($1, $2, $3, $4)',
            [this.title , this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {
        return db.query('DELETE FROM "node-complete".products WHERE id = $1',[id]);
    }

    static fetchAll() {
       return db.query('SELECT * FROM "node-complete".products');
    }

    static findById(id) {
        return db.query('SELECT * FROM "node-complete".products WHERE id = $1',[id]);
    }
}