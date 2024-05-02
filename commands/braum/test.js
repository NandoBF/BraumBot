const { SlashCommandBuilder } = require('discord.js');
const { LolApi, Constants } = require('twisted');
const { spectatorSummoner } = require('./common.js')




module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('testing command')
        .addStringOption(option => 
            option.setName('riotid')
                .setDescription('your riotId')
                .setRequired(true)),
    async execute(interaction){
        const riotId = interaction.options.getString('riotid', true);
    
        await interaction.reply(`check console`);
    }
}
