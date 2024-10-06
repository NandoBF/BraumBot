const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-channel')
        .setDescription('Creates a new channel. Needs admin perms')
        .setDefaultMemberPermissions(0)
        .addStringOption(option =>
            option.setName('channelname')
                .setDescription('The name of the channel to create')
                .setRequired(true)),
    async execute(interaction){
        const channelName = interaction.options.getString('channelname', true);
        
        try{
            interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
            });

            //var role = interaction.guild.roles.cache.find(role => console.log(role.name));
            
            await interaction.reply(`Created Channel ${channelName}`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error with creating the channel ${channelName}`)
        }
    }
}
