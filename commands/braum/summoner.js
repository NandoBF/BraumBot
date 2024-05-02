const { SlashCommandBuilder } = require('discord.js');
const { LolApi, Constants } = require('twisted');
const { getSummoner, handle_error } = require('./common.js')




module.exports = {
    data: new SlashCommandBuilder()
        .setName('summoner')
        .setDescription('gives info about a summoner')
        .addStringOption(option => 
            option.setName('riotid')
                .setDescription('your riotId')
                .setRequired(true)),
    async execute(interaction){
        try{ 
            const riotId = interaction.options.getString('riotid', true);

            let summoner = await getSummoner(riotId);
            // console.log(summoner)
            await  interaction.reply(`${summoner.summonerLevel}`);
        } catch(error){
            handle_error(error);
            await interaction.reply('Couldn´t do that.');

        } 
    }


}
