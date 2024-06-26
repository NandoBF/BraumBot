const { Cron } = require('croner');
const { LolApi, Constants, RiotApi } = require('twisted');
const { getAccount, getMatchList, getMatch, getParticipant } = require('../commands/braum/common.js');
const { getLastmatch, addBalance} = require('../commands/_shop.js');
const { Users, Poros } = require('../dbObjects.js');
const {roles} = require('../roles.json');

const updatematches = Cron("@hourly",
    (self) => {
        getAll();
        changeHunger(-5);
    }
)

function forceUpdate(){
    updatematches.trigger();
}

async function changeHunger(amount){
    const poros = await Poros.findAll();
    poros.forEach(poro => {
        poro.hunger += amount;
        poro.save()
    });
}


async function updateUser(user){
    const matchList = await getMatchList(user.puuid);
    if(user.lastmatch == '') user.lastmatch = matchList[1];
    for (matchId of matchList){
        if(matchId == user.lastmatch) break;
        const lastmatch = matchId;
        const match = await getMatch(matchId);
        const participant = await getParticipant(user.puuid, match);
        const dmgCalc = calcPoints(participant); 
        user.balance += dmgCalc;
        console.log(`User ${user.riotId} got ${dmgCalc} points!`);
    }
    updateLastMatch(user, matchList[0]);
    user.save();
}


async function updateLastMatch(user, lastmatch){
    user.lastmatch = lastmatch;
}


function calcPoints(participant){
    const kda = participant.challenges.kda;
    const dmgCalc = calcDamage(participant);
    const finalCalc = Math.ceil(dmgCalc * (1 + (kda/10)));
    return finalCalc;
}

function calcDamage(participant){
    const dmgBuildings = participant.damageDealtToBuildings * 1.5;
    const dmgChampions = participant.totalDamageDealtToChampions;
    const dmgPerMin = participant.challenges.damagePerMinute / 100;
    const dmgCalc = ((dmgBuildings + (dmgChampions * dmgPerMin)) / 100);
    return dmgCalc;
}


async function getAll(){
    const users = await Users.findAll();
    for(user of users){
        console.log('Updating User')
        updateUser(user);
    }
}



// SHOP UPDATE FUNCTIONS 
const changeShop = Cron("@daily",
    (self) => {
        require("../dbInit.js")(1);
    }
)





module.exports = {getAll, updateUser, forceUpdate};
