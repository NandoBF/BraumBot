const { Events } = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects.js');
const { currency } = require('../shop/common.js');
const { getAll, updateUser} = require('../repeat/common.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        const storedUsers = await Users.findAll();
        storedUsers.forEach(b => {
            currency.set(b.user_id, b),
            updateUser(b)
        });
		console.log(`Logged in as ${client.user.tag}`);
        console.log("Users have been updated");

	}
};
