const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Joga um dado.')
        .addStringOption(option => 
            option
                .setName('dado')
                .setDescription('Dado a ser jogado')
                .setRequired(true)
                .addChoices(
                    { name: 'd20', value: '20' },
                    { name: 'd12', value: '12' },
                    { name: 'd10', value: '10' },
                    { name: 'd8', value: '8' },
                    { name: 'd6', value: '6' },
                    { name: 'd4', value: '4' }
                )),
    async execute(interaction, client) {
        const dice = Number(interaction.options._hoistedOptions[0].value);
        const result = Math.floor(Math.random() * dice);
        return await interaction.reply(result+'');
    },
    emoji: '🎲'
};