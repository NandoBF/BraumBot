const { SlashCommandBuilder } = require('discord.js');
const { Poros } = require('../../poros/common.js');
const { Users, getItems, itemType } = require('../_shop.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equip')
        .setDescription('equip and item in your poro')
        .addStringOption(option => 
            option.setName('item')
                .setDescription('item to equip')
                .setRequired(true)),
    async execute(interaction){
        try{
            //CHANGE USER ITEMS TO WORK THROUGH ID'S
            const item = interaction.options.getString('item');
            const user = await Users.findOne({where: {user_id: interaction.user.id}});
            const user_items = await user.getItems();
            var has_item;
            var item_id;
            for(uItem of user_items){
                if(uItem.item.name == item){
                    has_item = 1;
                    item_id = uItem.item.item_id;
                    break;
                }
            }
            if(!has_item){
                await interaction.reply(`You do not have the item ${item}`);
                return;
           }
            const user_poro = await user.getPoro();
            // console.log(user_poro)
            // console.log(item_id)
            const itemtype = itemType(item_id);
            if(itemtype == 'hat') user_poro.head = item_id;
            else if (itemtype == 'body') user_poro.body = item_id;
            else if (itemtype == 'face') user_poro.face = item_id;
            user_poro.save();
            
            await interaction.reply(`Equipped your poro's ${itemtype}`);

        }catch(error){
            console.error(error)
        }
    }
}
