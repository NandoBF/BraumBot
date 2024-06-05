const { SlashCommandBuilder } = require('discord.js');
const { Poros } = require('../../poros/common.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changename')
        .setDescription('Change the name of your poro')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('The new name of your poro')
                .setRequired(true)),
    async execute(interaction){
        try{
            const new_name = interaction.options.getString('name');

            const poro = await Poros.findOne({where:{owner: interaction.user.id}});
            if(poro){
                poro.name = new_name;
                poro.save();
                await interaction.reply(`Your poro's name has been changed to ${poro.name}`);
            } else{
                await interaction.reply('Sorry! It seems you still dont have a poro. If you want one you can use the command /getporo');
            }
        }catch(error){
            console.error(error);
        }
    }
}
