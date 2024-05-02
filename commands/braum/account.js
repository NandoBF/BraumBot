const { SlashCommandBuilder } = require('discord.js');
const { RiotApi, Constants } = require('twisted');
const { getAccount, handle_error } = require('./common.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Provides information about your account')
        .addStringOption(option =>
            option.setName('riotid')
                .setDescription('The accounts riotId')
                .setRequired(true)),
    async execute(interaction) {
        const riotId = interaction.options.getString('riotid', true);
        
        try{
            let puuid;
            await getAccount(riotId).then(
                function(value) {puuid = value.puuid},
                function(error) {console.log(error)}
            )
            await interaction.reply(puuid);
        }catch (error) {
            handle_error(error);
            await interaction.reply(`There was an error`);
        }
    }
}
