const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula uma música na fila.'),
	async execute(interaction, client) {
		await interaction.deferReply();
        const queue = client.player.queues.get(interaction.guild);

        if(!queue){
            return await interaction.editReply('Nem to aí doido... 🙀');
        }

        if (!queue.currentTrack) {
            return await interaction.editReply('Não ta tocando nada cara... 🙀');
        }

        const currentSong = queue.currentTrack;

        queue.node.skip();

        return await interaction.editReply(`Por ordens de  👉 ${interaction.user}, o som **${currentSong.title}** foi de Indra... 💀`)
	},
	emoji: '⏭️',
};