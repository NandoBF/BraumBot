const { SlashCommandBuilder } = require('discord.js');
const { setRiot, getRiot } = require('../_shop.js');
const { getAccount } = require('./common.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setriotid')
        .setDescription('changes your saved riotId')
        .addStringOption(option =>
            option.setName('riotid')
                .setDescription('your riotId. Format: "gameName#tagline"')
                .setRequired(true)),

    async execute(interaction){
        const riotId = interaction.options.getString('riotid', true);
        const target = interaction.options.getUser('user') ?? interaction.user;
        try{
            const account = await getAccount(riotId);
            await setRiot(target.id,riotId, account.puuid);
            await getRiot(target.id);
            await interaction.reply(`Set your riot Id to: ${riotId}`);
        } catch(error){
            console.error(error)
            await interaction.reply(`Could not change your riotId :(`);
        }
    }

}
