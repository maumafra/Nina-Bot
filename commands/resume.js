const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Despausa o som.'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.queues.get(interaction.guild);

        if(!queue){
            return await interaction.editReply('Nem to aí doido... 🙀');
        }

        if (!queue.currentTrack) {
            return await interaction.editReply('Não ta tocando nada cara... 🙀');
        }

        queue.node.resume();
        await interaction.editReply(`Por ordens de 👉 ${interaction.user}, o som **${queue.currentTrack.title}** foi despausado... 😹`);
    },
    emoji: '⏯️',
}