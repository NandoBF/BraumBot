const { Users, CurrencyShop, Poros } = require('../dbObjects.js');
const { Collection } = require('discord.js');

const currency = new Collection();

async function changeName(id, new_name){
    const poro = await Poros.findOne({ where:{user_id: id}, });

    if(poro){
        poro.name = new_name;
        return poro.save();
    }
}

async function add_hunger(id, amount){
    const poro = await Poros.findOne({
        where: {user_id: id}, 
    });
    if(poro){
        poro.hunger += Number(amount);
        return poro.save();
    }

}

module.exports = { changeName, add_hunger, Users, Poros, CurrencyShop };
