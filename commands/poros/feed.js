const { SlashCommandBuilder } = require('discord.js');
const { Poros } = require('../../poros/common.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feed')
        .setDescription('Feed your poro(does not use food for now)')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of times to feed your poro')
                .setRequired(false)),

    async execute(interaction){
        try{
            const amount = interaction.options.getInteger('amount') ?? 1;
            const poro = await Poros.findOne({
                where: {owner: interaction.user.id}
            });
            if(poro){
                poro.hunger += 10 * amount;
                if(poro.hunger > 100) poro.hunger = 100;
                poro.save();
                await interaction.reply(`You fed your poro! He now has ${poro.hunger} hunger.`);
            } else{
                await interaction.reply('Could not find your poro...');
            }

        }catch(error){
            console.log(error)
        }

    }
        

}