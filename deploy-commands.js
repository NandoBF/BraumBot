const { REST, Routes } = require('discord.js');
const { token, client_id, guild_id } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');


const admin = process.argv.includes('--admin');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
    if (folder.startsWith('_')) continue;
	const commandsPath = path.join(foldersPath, folder);
	if(folder == 'help.js'){
		const command = require(commandsPath);
		commands.push(command.data.toJSON());
		continue;
	}
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
        if(file == 'common.js'){
            console.log('skipping common');
            continue;
        }
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		var data;
		if(admin){
			data = await rest.put(
				Routes.applicationGuildCommands(client_id, guild_id), //private server
				{ body: commands },
			);
		} else{
			data = await rest.put(
				Routes.applicationCommands(client_id), //squad server
				{ body: commands },
			);

		}
		// The put method is used to fully refresh all commands in the guild with the current set

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
