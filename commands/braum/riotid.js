const { SlashCommandBuilder } = require('discord.js');
const { setRiot, getRiot } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setriotid')
        .setDescription('changes your saved riotId')
        .addStringOption(option =>
            option.setName('riotid')
                .setDescription('your riotId, with tagline')
                .setRequired(true)),

    async execute(interaction){
        const riotId = interaction.options.getString('riotid', true);
        const target = interaction.options.getUser('user') ?? interaction.user;
        try{
            await setRiot(target.id,riotId);
            await interaction.reply(`Set your riot Id to: ${riotId}`);
        } catch(error){
            console.error(error)
            await interaction.reply(`Could not change your riotId :(`);
        }
    }

}
