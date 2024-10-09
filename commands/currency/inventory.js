const { SlashCommandBuilder } = require('discord.js');
const { Users, getItems } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('show inventory'),
    
    async execute(interaction){
        try{
            const target = interaction.user;
            const user = await Users.findOne({ where: {user_id: interaction.user.id} });
            if(!user) return;
            const items = await user.getItems();
            console.log(items);
            if(!items) {
                await interaction.reply('Sorry... This command is very bugged');
                return;
            }
            if(!items.length){
                await interaction.reply(`${target.tag} has nothing!`);
                return;
            }
            await interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
        } catch(error){
            interaction.deferReply();
            interaction.deleteReply();
            console.error(error);
        }
    }
};
