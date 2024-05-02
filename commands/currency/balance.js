const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../_shop.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('shows the balance of a user'),
	async execute(interaction) { 
        try{
            const target = interaction.options.getUser('user') ?? interaction.user;
            await interaction.reply(`${target.tag} has ${getBalance(target.id)}`);
        } catch(error){
            console.error(error);
        }
	},
};


