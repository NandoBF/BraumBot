const { SlashCommandBuilder } = require('discord.js');
const { CurrencyShop, Users } = require('../_shop.js');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveitem')
        .setDescription('admin command that gives an item to a user')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('item to give')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to give the item to')
                .setRequired(true)),
    async execute(interaction){
        if(interaction.user.id !== '339366997169012737'){
            await interaction.reply(`${interaction.user.username} you don't have the necessary permissions`);
            return;
        }
        const itemName = interaction.options.getString('item');
        const to_user = interaction.options.getUser('user');
        const user = await Users.findOne({where: {user_id: to_user.id}});
        const item = await CurrencyShop.findOne({ where: {name: {[Op.like]: itemName } } });
        if(!item) return;
        await user.addItem(item);
        interaction.deferReply();
        interaction.deleteReply();
    }
}
