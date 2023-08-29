// Utilizar o discord-player@5.3.2, pq a versão 5.4.0 está com defeito
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Adiciona um som na fila.')
        .addStringOption((option) => option
            .setName('query')
            .setDescription('Escreva uma música, artista ou um link')
            .setRequired(true)),
	async execute(interaction, client) {
        await interaction.deferReply();

		if(!interaction.member.voice.channelId){
            return interaction.editReply('Você não tá em um canal de voz! 😾')
        }
        if(interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            return interaction.editReply('Você não tá no meu canal de voz! 😾')
        }

        const query = interaction.options.getString("query");

        const result = await client.player.search(query, {
            requestedBy: interaction.user
        });

        if (!result.hasTracks()) {
            return interaction.followUp(`Não consegui achar isso 👉 **${query}**`)
        }

        const options = {
            nodeOptions: {
                leaveOnEmptyCooldown: 200000,
				leaveOnEmpty: true,
				leaveOnEnd: false,
				pauseOnEmpty: true,
                metadata: {
                    channel: interaction.channel,
					client: interaction.guild?.members.me,
					requestedBy: interaction.user.username
                }
            }
        }

        try {
            const { track } = await client.player.play(interaction.member.voice.channel, query, options);
    
            if (track.playlist) {
                return interaction.followUp(`Colocando **${track.playlist.tracks.length}** sons desta playlist 👉 **${track.playlist.title}** na fila, a pedidos de ${interaction.user} 😸`);
            } else {
                return interaction.followUp(`Colocando este som 👉 **${track.title}** na fila, a pedidos de ${interaction.user} 😸`);
            }
        } catch (e) {
            console.log(e);
            return interaction.followUp(`Não rolou... 🙀  Errei, fui mlk  😿`);
        }
	},
    emoji: '▶️',
};