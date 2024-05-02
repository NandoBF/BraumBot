const { Events } = require('discord.js');
const { addBalance } = require('../shop/common.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message){
        if(message.author.bot) return;
        console.log('message detected');
        addBalance(message.author.id, 1);
    },

};
