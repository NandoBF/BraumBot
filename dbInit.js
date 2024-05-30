const Sequelize = require('sequelize');
const items_json = require('./shop/items.json');


const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',

});



const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);
require('./models/Poros.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
const update_shop = process.argv.includes('--shop') || process.argv.includes('-s');

let shop = [];


function addShopItems(items){
    for(element in items){
        var item = items[element];
        shop.push(CurrencyShop.upsert({name: item.name, cost: item.cost}))
    }

}


sequelize.sync({ force }).then(async () => {
    
    if(update_shop){ 
        await CurrencyShop.truncate();
        console.log('CurrencyShop truncated');
    }
    addShopItems(items_json);
    await Promise.all(shop);
    console.log('Database synced');

    sequelize.close();
}).catch(console.error);



