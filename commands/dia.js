const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dia')
		.setDescription("Mensagem de bom dia."),
	async execute(interaction) {
		await interaction.reply('Bom dia!');
	},
	emoji: ':sun_with_face:'
};