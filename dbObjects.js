const Sequelize = require('sequelize');
const express = require('express');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false, 
    storage: 'database.sqlite',

});
const app = express();
const port = 3000;

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Poros = require('./models/Poros.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item'});

Reflect.defineProperty(Users.prototype, 'givePoro', {
    value: async function givePoro(name){
        const user_poro = await Poros.findOne({
            where: {owner: this.user_id},
        });
        if(user_poro){
            console.log(`User ${this.user_id} already has a poro.`);
            return;
        }
        try{
            return Poros.create({owner: this.user_id, name: name});
        }catch(error){
            console.error(error);
        }
    },
});


Reflect.defineProperty(Users.prototype, 'addItem', {
    value: async function addItem(item) {
        const userItem = await UserItems.findOne({
            where: { user_id: this.user_id, item_id: item.id},
        });
        if (userItem){
            userItem.amount += 1;
            return userItem.save();
        }
        try{
            return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1});
        }catch(error){
            console.error(error);
        }
    },

});

Reflect.defineProperty(Users.prototype, 'getItems', {
    value: function getItems() {
        return UserItems.findAll({
            where: { user_id: this.user_id },
            include: ['item'],
        });
    },
});

app.use(express.static('display'));

app.get('/api/users', async(req,res) => {
    const users = await Users.findAll();
    res.json(users);
});

app.listen(port, () => {
    console.log(`#### http://localhost:${port} ####`);
});



module.exports = { Users, CurrencyShop, UserItems, Poros };
