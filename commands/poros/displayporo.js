const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { Users, CurrencyShop, Poros } = require('../../poros/common.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poro')
        .setDescription('displays your poro'),
    
    async execute(interaction){
        try{
            let currentPage = 1;
            const filter = (click) => click.user.id === interaction.user.id;

            const poro = await Poros.findOne({
                where:{owner: interaction.user.id}
            });

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



            const accessEmbed = new EmbedBuilder()
                .setTitle('Accessories')
                .addFields(
                    {name: 'Body', value: poro.body.toString()},
                    {name: 'Head', value: poro.head.toString()},
                    {name: 'Face', value: poro.face.toString()},
                );

            const profileEmbed = new EmbedBuilder()
                .setTitle('Profile')
                .addFields(
                    {name: 'Name', value: poro.name},
                    {name: 'Model', value: poro.model.toString()},
                );

            const message = 'Test message';

            const reply = await interaction.reply({embeds: [accessEmbed],components: [row]});

            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: 60_000,
            });

            collector.on('collect', async (interaction) => {
                if(interaction.customId === 'next'){
                    if(currentPage == 1){
                        await reply.edit({embeds: [profileEmbed]});
                        currentPage = 2;
                        await interaction.reply('Profile Page');
                    } else await interaction.reply('No more pages that way');

                }
                
                if(interaction.customId === 'prev'){
                    if(currentPage == 2){
                        await reply.edit({embeds: [accessEmbed]});
                        currentPage = 1;
                        await interaction.reply('Accessories Page');
                    } else await interaction.reply('No more pages that way');

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
    
}
