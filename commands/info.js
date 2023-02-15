const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription("Informações sobre a gatinha preferida do servidor."),
	async execute(interaction) {
		await interaction.reply('WIP :scream_cat:');
	},
	emoji: ':kissing_cat:',
};