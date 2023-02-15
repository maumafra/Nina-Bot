const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tarde')
		.setDescription("Mensagem de boa tarde."),
	async execute(interaction) {
		await interaction.reply('Boa tarde!');
	},
	emoji: ':leaves:',
};