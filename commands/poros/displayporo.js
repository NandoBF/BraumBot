const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { Users, CurrencyShop, Poros } = require('../../poros/common.js');
const { Op } = require('sequelize');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poro')
        .setDescription('displays your poro')
        .addBooleanOption(option =>
            option.setName('ephemeral')
                .setDescription('Make command only visible to you')
                .setRequired(false)),
    async execute(interaction){
        try{
            const is_ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
            let currentPage = 1;
            const filter = (click) => click.user.id === interaction.user.id;

            const poro = await Poros.findOne({
                where:{owner: interaction.user.id}
            });
            
            if(!poro){
                interaction.deferReply();
                interaction.deleteReply();
            }
            console.log(poro.health_points);
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

            const body_item = await CurrencyShop.findOne({where: {item_id: {[Op.like]: poro.body}}});
            const head_item = await CurrencyShop.findOne({where: {item_id: {[Op.like]: poro.head}}});
            const face_item = await CurrencyShop.findOne({where: {item_id: {[Op.like]: poro.face}}});

            const accessEmbed = new EmbedBuilder()
                .setTitle('Accessories')
                .addFields(
                    {name: 'Body', value: body_item.name},
                    {name: 'Head', value: head_item.name},
                    {name: 'Face', value: face_item.name},
                );

            const profileEmbed = new EmbedBuilder()
                .setTitle('Profile')
                .addFields(
                    {name: 'Name', value: poro.name},
                    {name: 'Model', value: poro.model.toString()},
                );

            const message = 'Test message';

            const reply = await interaction.reply({embeds: [accessEmbed],components: [row], ephemeral: is_ephemeral});

            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter,
                time: 60_000,
            });

            collector.on('collect', async (interaction) => {
                if(interaction.customId === 'next'){
                    if(currentPage == 1){
                        await interaction.update({embeds: [profileEmbed]});
                        currentPage = 2;
                    } else await interaction.reply('No more pages that way');

                }
                
                if(interaction.customId === 'prev'){
                    if(currentPage == 2){
                        await interaction.update({embeds: [accessEmbed]});
                        currentPage = 1;
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
