const { Client, Events, GatewayIntentBits, Collection, codeBlock } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path')
const {token} = require('./config.json');
const { Op } = require('sequelize');
const { addBalance, getBalance } = require('./shop/common.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

client.cooldowns = new Collection();
client.commands = new Collection();




const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    if(folder.startsWith("_")) continue;
	const commandsPath = path.join(foldersPath, folder);
	if(folder == 'help.js'){
		const command = require(commandsPath);
		client.commands.set(command.data.name, command);
		continue;
	}
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles){
        if(file == 'common.js'){
            continue;
        }
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`The command at ${filePath} is missing a require 'data' or 'execute property.'`);
		}
	}
}





const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    console.log(file);
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.login(token)
