const { SlashCommandBuilder } = require('discord.js');
const { addBalance } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givemoney')
        .setDescription('admin command to give money')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('amount to give (or take)')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('user to give money to')
                .setRequired(true)),
    async execute(interaction){
        if(interaction.user.id !== '339366997169012737'){
            await interaction.reply(`${interaction.user.username} you don't have the necessary permissions`);
            return;
        }
        const amount = interaction.options.getString('amount');
        const to_user = interaction.options.getUser('user');
        addBalance(to_user.id, parseInt(amount,10));
        interaction.deferReply();
        interaction.deleteReply();
    }
}
