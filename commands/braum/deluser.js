const { SlashCommandBuilder } = require('discord.js');
const { delUser } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deluser')
        .setDescription('changes your saved riotId')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('user to delete')
                .setRequired(false)),
    
    async execute(interaction){
        var target;
        if((interaction.user.id == 339366997169012737)){
            target = interaction.options.getUser('user');
        } else {
            target = interaction.user;

        }
        try{
            await delUser(target.id);
            await interaction.reply('User deleted successfully');
        } catch(error){
            console.log(error);
            await interaction.reply('Something went wrong.');

        }
    }
}