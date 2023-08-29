const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Faz eu sair do canal de voz.'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.queues.get(interaction.guild);

        if(!queue){
            return await interaction.editReply('Nem to aí doido... 🙀');
        }

        queue.delete();
        await interaction.editReply('😾😾');
    },
    emoji: '😾',
}
