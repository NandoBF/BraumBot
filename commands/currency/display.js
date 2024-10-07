const { SlashCommandBuilder, codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { CurrencyShop } = require('../_shop.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('displays the shop'),
    async execute(interaction){
        try{
            let currentPage = 0;
            const items = await CurrencyShop.findAll();
            // await interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}`).join('\n')));
            let embeds = [];
            const filter = (click) => click.user.id === interaction.user.id;

            for(let i = 0; i < items.length/5; i++){
                const embed = new EmbedBuilder()
                    .setTitle('Accessories');
                for(let j = 0; j < 5; j++){
                    if(j + i*5 >= items.length) break;
                    const item = items[j + i*5];
                    embed.addFields({name: item.name, value: item.cost.toString()});
                }
                embeds.push(embed);
            }

            const next = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('next')
                .setStyle(ButtonStyle.Secondary); 

            const prev = new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('prev')
                .setStyle(ButtonStyle.Secondary);  

            const row = new ActionRowBuilder()
                .addComponents(prev, next);

            const reply = await interaction.reply({embeds: [embeds[0]], components: [row], ephemeral: true});


            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: 60_000,
            });


            collector.on('collect', async (interaction) => {
                if(interaction.customId === 'next'){
                    // if(currentPage + 1 > embeds.length) return;
                    currentPage = (currentPage + 1) % embeds.length;
                    await interaction.update({embeds: [embeds[currentPage]]});
                }
                
                if(interaction.customId === 'prev'){
                    currentPage = (currentPage - 1) % embeds.length;
                    await interaction.update({embeds: [embeds[currentPage]]});
                }

            })

            collector.on('end', () => {
                next.setDisabled(true);
                prev.setDisabled(true);
                reply.edit({
                    components: [],
                });
            })

        }catch(error){

            console.error(error);
        }

    }
};
    
