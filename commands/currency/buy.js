const { SlashCommandBuilder } = require('discord.js');
const { Users, getBalance, addBalance, CurrencyShop } = require('../_shop.js');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('buy an item')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('item to buy')
                .setRequired(true)),
    async execute(interaction){
        try{
            const itemName = interaction.options.getString('item');
            const item = await CurrencyShop.findOne({ where: {name: {[Op.like]: itemName } } });

            if(!item) await interaction.reply('That item doesnt exist.'); 
            if(item.cost > getBalance(interaction.user.id)) {
                await interaction.reply(`You currently have ${getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
            }
            const user = await Users.findOne({where: { user_id: interaction.user.id}});
            addBalance(interaction.user.id, -item.cost);
            await user.addItem(item);

            await interaction.reply(`You've bought: ${item.name}.`);

        }catch(error){
            console.error(error);
        }
    }
        
}

