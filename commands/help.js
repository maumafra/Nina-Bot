const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const commandData = {name: 'help', description: "Mostra todos os comandos do bot.", emoji: ':scroll:'};

const getCommands = (() => {
    const fs = require('node:fs');
    const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && !file.includes('help')).sort();
    const fields = [];

    for (const file of commandFiles) {
        const command = require(`./${file}`);
        fields.push({ name: `/${command.data.name}`, value: `${command.emoji} ${command.data.description}`});
    }
    
    return fields;
})

const helpEmbed = new EmbedBuilder()
	.setColor('Red')
	.setTitle('Lista de Comandos')
	.addFields(
        { name: '\u200B', value: '\u200B' },
		{ name: `/${commandData.name}`, value: `${commandData.emoji} ${commandData.description}` },
        ...getCommands()
	)
	.setTimestamp()

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandData.name)
		.setDescription(commandData.description),
	async execute(interaction) {
		await interaction.reply({ embeds: [helpEmbed] , ephemeral: true});
	},
};