const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noite')
		.setDescription("Mensagem de boa noite."),
	async execute(interaction) {
		await interaction.reply('Boa noite!');
	},
	emoji: ':new_moon_with_face:',
};