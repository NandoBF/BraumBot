const { Cron } = require('croner');
const { LolApi, Constants, RiotApi } = require('twisted');
const { getAccount, getMatchList, getMatch, getParticipant } = require('../commands/braum/common.js');
const { getLastmatch, addBalance} = require('../commands/_shop.js');
const { Users, Poros } = require('../dbObjects.js');
const {backupDatabase} = require('../backups/backup_creation.js');

const updatematches = Cron("@hourly",
    (self) => {
        getAll();
        changeHunger(-5);
        backupDatabase('./database.sqlite');
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


async function updateUser(user, poro){
    if(user.puuid === '') return;
    // console.log(user.user_id);
    const matchList = await getMatchList(user.puuid);
    if(user.lastmatch == '') user.lastmatch = matchList[1];

    let i = 0;
    for (matchId of matchList){
        if(i === 5) break; //max of 5 matches per user; Because of rate limits
        if(matchId == user.lastmatch) break;
        const lastmatch = matchId;
        const match = await getMatch(matchId);
        const participant = await getParticipant(user.puuid, match);
        let dmgCalc = calcPoints(participant);
        if(poro) dmgCalc *= poro.point_bonus;
        // user.balance += Number(dmgCalc);
        // user.save();
        addBalance(user.user_id, dmgCalc);
        console.log(`User ${user.riotId} got ${dmgCalc} points!`);
        i += 1;
    }
    updateLastMatch(user, matchList[0]);
    user.save();
}


async function updateLastMatch(user, lastmatch){
    user.lastmatch = lastmatch;
}


function calcPoints(participant){
    try{
        const roles = require('../roles.json');
        const role =  roles[participant.teamPosition];
        if(!role) role = participant.individualPosition;
        if(!role) return 0;
        const kda = participant.challenges.kda;
        const dmgCalc = calcDamage(participant, role);
        const visionCalc = calcVision(participant, role);
        const csCalc = calcCS(participant, role);
        const finalCalc = Math.ceil(dmgCalc * (1 + (kda/10)) + visionCalc + csCalc);
        return finalCalc;
    }catch(error){
        console.log("Something went wrong calculating the points for this participant")
        console.log(participant.teamPosition);
        return 0;
    }
}

function calcCS(participant, role){
    return participant.totalMinionsKilled * 10 * role.CSMultiplier;
}


function calcVision(participant, role){
    const visCalc = (participant.visionScore * 10) * role.VisionScoreMultiplier;
    return visCalc;
}


function calcDamage(participant, role){
    console.log(participant.teamPosition)
    const dmgBuildings = participant.damageDealtToBuildings * role.buildingDmgMultiplier;
    const dmgChampions = participant.totalDamageDealtToChampions * role.championDmgMultiplier;
    const dmgPerMin = participant.challenges.damagePerMinute / 100;
    const dmgCalc = ((dmgBuildings + (dmgChampions * dmgPerMin)) / 100);
    return dmgCalc;
}

async function getAll(){
    const users = await Users.findAll();
    for(user of users){
        const poro = Poros.findOne({where: {owner: user.user_id}});
        console.log('Updating User')
        updateUser(user,poro);
    }
}

// SHOP UPDATE FUNCTIONS 
const changeShop = Cron("@daily",
    (self) => {
        require("../dbInit.js")(1);
    }
)

module.exports = {getAll, updateUser, forceUpdate};
