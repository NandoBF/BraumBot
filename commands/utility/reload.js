const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload-utils')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload')
				.setRequired(true)),
	async execute(interaction){
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if(!command){
			return interaction.reply(`No command with name ${commandName}`);
		}

		delete require.cache[require.resolve(`./${command.data.name}.js`)];

		try{
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(`./${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Command ${newCommand.data.name} was reloaded!`);
		} catch (error) {
			console.error(error);
			await interaction.reply(`There was an error reloading the command ${error.message}`);
		}
	},
};
