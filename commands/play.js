const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');


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
            requestedBy: interaction.user,
            fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
        });

        if (!result.hasTracks()) {
            return interaction.editReply(`Não consegui achar isso 👉 **${query}**`)
        }

        const options = {
            nodeOptions: {
                leaveOnEmptyCooldown: 200000,
				leaveOnEmpty: true,
				leaveOnEnd: false,
				pauseOnEmpty: true,
                bufferingTimeout: 0,
                metadata: {
                    channel: interaction.channel,
					client: interaction.guild?.members.me,
					requestedBy: interaction.user.username
                }
            }
        }

        try {
            const { track } = await client.player.play(interaction.member.voice.channel, result, options);
    
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