const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Mostra a fila de músicas'),
	async execute(interaction) {
		await interaction.reply('WIP :scream_cat:');
	},
	emoji: '💿',
};