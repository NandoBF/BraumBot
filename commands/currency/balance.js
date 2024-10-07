const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../_shop.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('shows the balance of a user')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Make command only visible to you')
                .setRequired(false)),
	async execute(interaction) { 
        try{
            const is_ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
            const target = interaction.options.getUser('user') ?? interaction.user;
            await interaction.reply({content:`${target.tag} has ${getBalance(target.id)}`, ephemeral: is_ephemeral});
        } catch(error){
            console.error(error);
        }
	},
};


