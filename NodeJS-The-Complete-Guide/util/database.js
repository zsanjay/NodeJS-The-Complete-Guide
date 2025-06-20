const Sequelize  = require('sequelize');

const sequelize = new Sequelize('product', 'sanjay', 'Dubai@6140', {
    dialect: 'postgres',
    host : 'localhost'
});

module.exports = sequelize;


