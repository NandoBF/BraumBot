const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { currency } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('displays the leaderboard'),
    async execute(interaction){
        try{
            await interaction.reply(codeBlock(
                currency.sort((a,b) => b.balance - a.balance)
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${user.riotId}: ${user.balance}`)
                    .join('\n'),
                )
            );
        } catch(error){
            console.error(error);
        }
    }
};
