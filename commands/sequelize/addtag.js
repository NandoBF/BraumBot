const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtag')
        .setDescription('adds a tag')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('tag name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('tag description')
                .setRequired(true)),

    async execute(interaction){
        const tagName = interaction.options.getString('name');
        const tagDesc = interaction.options.getString('description');
        
        try{
            const tag = await Tags.create({
                name: tagName,
                description: tagDesc,
                username: interaction.user.username,
            });
            return interaction.reply(`Tag ${tag.name} added.`);

        } catch(error){
            if(error.name  === 'SequelizeUniqueConstraintError'){
                return interaction.reply('Already exists');
            }
            console.log(error);
            return interaction.reply('Error adding tag');
    
        }

    }

}
