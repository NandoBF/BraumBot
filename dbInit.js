const Sequelize = require('sequelize');

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

const shop = [
    CurrencyShop.upsert({name: 'Poro Food', cost: 100}),
    CurrencyShop.upsert({ name: 'Premium Poro Food', cost: 1000}),
    CurrencyShop.upsert({ name: 'Gold bathed Poro Food', cost: 10000}),
    CurrencyShop.upsert({name: 'YOMOM', cost: 9999}),
];


sequelize.sync({ force }).then(async () => {
    
    if(update_shop){ 
        await CurrencyShop.truncate();
        console.log('CurrencyShop truncated');
    }

    await Promise.all(shop);
    console.log('Database synced');

    sequelize.close();
}).catch(console.error);



