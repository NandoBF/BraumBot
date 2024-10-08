const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, codeBlock} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help command'),

        async execute(interaction){
            let str;
            try{
                const commandFolders = fs.readdirSync(__dirname).filter(file => !(file.endsWith('.js')));
                for(const folder of commandFolders){
                    if (folder.startsWith('_') || folder.endsWith('.js')) continue;
                    const commandsPath = path.join(__dirname, folder);
	                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                    for(const file of commandFiles){
                        if(file == 'common.js') continue;
                        const command = require(`./${folder}/${file}`);
                        str += `Name: ${command.data.name}, Description: ${command.data.description} \n`;
                    }    
                }
                await interaction.reply({content: codeBlock(str), ephemeral: true});
            }catch(error){
                console.error(error);
            }

        }
}