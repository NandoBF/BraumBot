const { SlashCommandBuilder } = require('discord.js');
const { forceUpdate } = require('../../repeat/common.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('forceupdate')
        .setDescription('forces an update on the users'),
    
    async execute(interaction){
        forceUpdate();
        await interaction.reply('Users have been updated');
    }
}
