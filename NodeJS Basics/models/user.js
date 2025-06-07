const { ObjectId } = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items : []}
        this._id = id;
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cartItem => {
            return cartItem.productId.toString() === product._id.toString();
        })

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }

        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDB();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        );
    }

    getCart() {
        const db = getDB();
        const productIds = this.cart.items.map(item => item.productId);
        return db.collection('products').find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p, quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
        const db = getDB();
        return db
        .collection('users')
        .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items : updatedCartItems} } }
        );
    }

    addOrder() {
        const db = getDB();
        return this.getCart().then(products => {
            const order = {
                items : products,
                user : {
                    _id : new ObjectId(this._id),
                    name: this.name
                }
            };
            return db.collection('orders').insertOne(order);
        })
        .then(result => {
            this.cart = { items : []};
            return db
            .collection("users")
            .updateOne(
                { _id : new ObjectId(this._id)},
                { $set : { cart : { items : []}}}
            );
        });
    }

    getOrders() {
        const db = getDB();
        return db
            .collection('orders')
            .find({ 'user._id': new ObjectId(this._id) })
            .toArray();
    }

    static findById(userId) {
        const db = getDB();
        return db.collection('users').findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;