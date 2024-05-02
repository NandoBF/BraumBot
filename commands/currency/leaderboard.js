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
                    .filter(user => interaction.client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).tag)}: ${user.balance}`)
                    .join('\n'),
                )
            );
        } catch(error){
            console.error(error);
        }
    }
};
