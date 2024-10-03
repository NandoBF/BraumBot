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
    console.log("--NEW SHOP ITEMS--")
    for(item of items){
        console.log(item)
        shop.push(CurrencyShop.upsert({name: item.name, item_id: item.item_id,cost: item.cost}))
    }
    console.log("------------------")
}

//
// function pushItems(items, targets,itemNumber){
//     const tarArr = Object.keys(targets);
//     if(itemNumber > tarArr.length) return;
//     for(let i = 0; i < itemNumber; i++){
//         const index = Math.floor(Math.random() * tarArr.length)
//         const item = tarArr[index];
//         items.push(targets[item]);
//         tarArr.splice(index, 1);
//     }
// }
//


function pushAllItems(items, targets){
    for(item in targets){
        items.push(targets[item]);
    }
}

async function updateShop(){
    await CurrencyShop.truncate();
    console.log('CurrencyShop truncated');

}

module.exports = (update_shop) => {
    if(!update_shop) return;
    updateShop();

}

sequelize.sync({ force }).then(async () => {
    let items = []; 
    if(update_shop) updateShop(); 
    const hatJson = require('./shop/hats.json');
    const faceJson = require('./shop/face.json');
    const bodyJson = require('./shop/body.json');
    const mixJson = require('./shop/mix.json');
    pushAllItems(items, hatJson);
    pushAllItems(items, faceJson);
    pushAllItems(items, bodyJson);
    pushAllItems(items, mixJson);
    addShopItems(items);
    await Promise.all(shop);
    console.log('Database synced');

    sequelize.close();
}).catch(console.error);




