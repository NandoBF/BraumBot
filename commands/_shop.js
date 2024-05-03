const { Users, CurrencyShop } = require('../dbObjects.js');
const { Collection } = require('discord.js');
const { currency } = require('../shop/common.js');


async function addBalance(id, amount){
    const user = currency.get(id);

    if(user){
        user.balance += Number(amount);
        return user.save();
    }

    const newUser = await Users.create({ user_id: id, balance: amount});
    currency.set(id, newUser);

    return newUser;
}

function getBalance(id){
    const user = currency.get(id);
    return user ? user.balance : 0;
}


async function setRiot(id, riotId){
    const user = currency.get(id);
    if(user){
        user.riotId = riotId;
        return user.save();
    }
    const newUser = await Users.create({user_id: id, riotId: riotId});
    return newUser;
}

function getRiot(id){
    const user = currency.get(id);
    console.log(user.riotId);
}

module.exports = { addBalance, getBalance, Users, CurrencyShop, currency, setRiot, getRiot};
