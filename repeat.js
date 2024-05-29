const { Cron } = require('croner');
const { LolApi, Constants, RiotApi } = require('twisted');

const riotapi = new RiotApi("RGAPI-f0b55ee2-9f39-4da8-a274-d96b26ed1086");


function r_split(riotId){
    return riotId.split('#');
}



async function getAccount(riotId){
    let newR = r_split(riotId);
    const name = newR[0];
    const tagline = newR[1];

    return (await riotapi.Account.getByRiotId(name, tagline, Constants.RegionGroups.EUROPE)).response 
}


async function matchV5() {
    const api = new LolApi("RGAPI-f0b55ee2-9f39-4da8-a274-d96b26ed1086");

    const account = await getAccount("Romans 7 19#06020");   
    console.log(account); 

    const matchList = (await api.MatchV5.list(account.puuid, Constants.RegionGroups.EUROPE)).response

    const matchId = matchList[0];
    const match = (await api.MatchV5.get(matchId, Constants.RegionGroups.EUROPE)).response
    const participants_id = match.metadata.participants;
    let index = -1;
    for(let i = 0; i < participants_id.length;i++){
        if(account.puuid == participants_id[i]){
            index = i;
            break;
        }
    }
    if(index == -1) console.log("Participant not found");

    
    console.log(match.info.participants[index]);
}



//do this every hour
const job = Cron("@hourly",
    (self) => {
        console.log('doing this');
    }
);


//do this every second
const job1 = Cron("* * * * * *",
    (self) => {
        console.log(job.nextRun().toLocaleString());
    }    
);

matchV5();
job1.stop()
