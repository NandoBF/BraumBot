const { SlashCommandBuilder } = require('discord.js');
const { Users, CurrencyShop, Poros } = require('../../poros/common.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getporo')
        .setDescription('get a new poro')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name for your poro')
                .setRequired(true)),
    async execute(interaction){
        try{
            const poro_name = interaction.options.getString('name');
            
            const user = await Users.findOne({where: {user_id: interaction.user.id}});
            await user.givePoro(poro_name);

            await interaction.reply(`I've given you a new poro with the name ${poro_name}!`);

        }catch(error){
            console.error(error);
        }
    }
}
