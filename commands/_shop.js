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
    return user ? user.balance : 'no user';
}

async function delUser(id){
    const user = currency.get(id);
    if(user){
        try{
            currency.delete(id)
            user.destroy();
            console.log('Destroyed user');
            return;
        }catch(error){
            console.log(error);
            return;
        }
    } else {
        console.log('User not found');
        return;
    }
}


async function setRiot(id, riotId, puuid){
    const user = currency.get(id);
    if(user){
        user.riotId = riotId;
        user.puuid = puuid;
        console.log(user);
        return user.save();
    }
    const newUser = await Users.create({user_id: id, balance: 0 ,riotId: riotId, puuid:puuid});
    newUser.save();
    currency.set(id, newUser);
    return newUser;
}



function getRiot(id){
    const user = currency.get(id);
    console.log(user.riotId);
}

function getLastmatch(id){
    const user = currency.get(id);
    return user.lastmatch;
}

async function updateLastmatch(id, lastmatch){
    const user = currency.get(id);
    if(user){
        user.lastmatch = lastmatch;
        return user.save();
    }
    const newUser = await Users.create({user_id: id, lastmatch: lastmatch});
    return newUser;
}

function itemType(item_id){
    if(item_id >= 3000) return 'body';
    if(item_id >= 2000) return 'face';
    if(item_id >= 1000) return 'hat';
}


module.exports = { addBalance, getBalance, Users, CurrencyShop, currency, setRiot, getRiot, getLastmatch, updateLastmatch, itemType, delUser};
