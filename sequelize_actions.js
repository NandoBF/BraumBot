const { Sequelize, DataTypes } = require('sequelize');



const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',

});

//queryInterface.removeColumn('poros', 'Health Points', {});

