const { api_key } = require('./config.json');
const { LolApi, RiotApi, Constants } = require('twisted');

const lolapi = new LolApi({
    rateLimitRetry: true,
    rateLimitRetryAttempts: 2,
    key: api_key
});

const riotapi = new RiotApi({
    rateLimitRetry: true,
    rateLimitRetryAttemps: 2,
    key: api_key
});

///////////////////////
// SUPPORT FUNCTIONS //
///////////////////////


function r_split(riotId){
    return riotId.split('#');
}

function handle_error(error){
    console.log(error);
}





/////////////
// ACCOUNT //
/////////////
async function getAccount(riotId){
    let newR = r_split(riotId);
    const name = newR[0];
    const tagline = newR[1];

    return (await riotapi.Account.getByRiotId(name, tagline, Constants.RegionGroups.EUROPE)).response 
}


//////////////
// SUMMONER //
//////////////
async function getSummoner(riotId){
    const user = await getAccount(riotId);

    return (await lolapi.Summoner.getByPUUID(user.puuid, Constants.Regions.EU_WEST)).response
}


///////////////
// SPECTATOR //
///////////////
async function spectatorSummoner(riotId){
    const user = await getAccount(riotId);
    const puuid = user.puuid;

    const data = (await lolapi.SpectatorV5.activeGame(puuid, Constants.Regions.EU_WEST)).response
    console.log(data)
}

//spectatorSummoner("iDannuwu#EUW");

module.exports = { handle_error ,getAccount, getSummoner, spectatorSummoner };
