const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { CurrencyShop } = require('../_shop.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('displays the shop'),
    async execute(interaction){
        try{
            const items = await CurrencyShop.findAll();
            await interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}`).join('\n')));
        }catch(error){
            console.error(error);
        }

    }
};
    
