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

async function getSummonerPUUID(puuid){
    return (await lolapi.Summoner.getByPUUID(puuid, Constants.Regions.EU_WEST)).response

}

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


async function getMatchList(puuid){
    // const account = await getAccount(riotId);
    // const puuid = account.puuid;
    const matchlist = (await lolapi.MatchV5.list(puuid, Constants.RegionGroups.EUROPE)).response;

    return matchlist;
}

async function getMatch(matchId){
    const match = (await lolapi.MatchV5.get(matchId, Constants.RegionGroups.EUROPE)).response;

    return match;
}

async function getParticipant(puuid, match){
    const participants_id = match.metadata.participants;
    let index = -1;
    for(let i = 0; i < participants_id.length; i++){
        if(puuid == participants_id[i]){
            index = i;
            break;
        }
    }
    return (match.info.participants[index]);
}


//spectatorSummoner("iDannuwu#EUW");

module.exports = { handle_error ,
    getAccount, 
    getSummoner, 
    spectatorSummoner,
    getMatchList,
    getMatch,
    getParticipant,
    getSummonerPUUID
};
