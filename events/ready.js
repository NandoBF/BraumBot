const { Events } = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects.js');
const { currency } = require('../shop/common.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => currency.set(b.user_id, b));

		console.log(`Logged in as ${client.user.tag}`);

	},
};
