const { getDB } = require('../util/database');
const { ObjectId } = require('mongodb');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDB();
        let dbOp;
        if(this._id) {
            // Update the product
            dbOp = db
            .collection('products')
            .updateOne({ _id : this._id }, {$set: this});
        } else {
            dbOp = db
            .collection('products')
            .insertOne(this);
        }
       return dbOp
       .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(prodId) {
        const db = getDB();
        return db.collection('products')
        .find({ _id : new ObjectId(prodId) })
        .next()
        .then(product => {
            return product;
        })
        .catch(err => { 
            console.log(err)
        });   
    }

    static deleteById(prodId) {
        const db = getDB();
        return db.collection('products')
        .deleteOne({ _id : new ObjectId(prodId)})
        .then(result => {
            console.log('Deleted');
        })
        .catch(err => { 
            console.log(err)
        }); 
    }
}

module.exports = Product;
