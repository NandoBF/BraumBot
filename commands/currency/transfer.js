const { SlashCommandBuilder } = require('discord.js');
const { Users, getBalance, addBalance } = require('../_shop.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('transfer currency')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('amount to transfer')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('person to transfer to')
                .setRequired(true)),
    async execute(interaction){
        try{
            const currentAmount = getBalance(interaction.user.id);
            const transferAmount = interaction.options.getInteger('amount');
            const transferTarget = interaction.options.getUser('user');

            if(transferAmount > currentAmount){
                await interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}`);
            }
            if (transferAmount <= 0){
                await interaction.reply(`Invalid amount to transfer`);
            }

            addBalance(interaction.user.id, -transferAmount);
            addBalance(transferTarget.id, transferAmount);

            await interaction.reply(`Transfered ${transferAmount} to ${transferTarget.tag}`);
        } catch(error){
            console.log(error);
        }
    }
};
