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
        const queue = client.player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnEmpty: true,
            metadata: {
                channel: interaction.channel
            }
        });

        try{
            if(!queue.connection){
                await queue.connect(interaction.member.voice.channel);
            }
        } catch (error) {
            console.error(error);
            queue.destroy();
            return interaction.editReply('Não consegui entrar no canal de voz... 😿')
        }

        const result = await client.player.search(query, {
            requestedBy: interaction.user
        });

        if(!result){
            await queue.destroy();
            return interaction.followUp(`Não consegui achar isso 👉 **${query}**`)
        }

        try{
            if(result.playlist){
                queue.addTracks(result.tracks)
            } else {
                queue.addTrack(result.tracks[0])
            }

            if(!queue.playing){
                await queue.play();
            }
        } catch (error) {
            console.error(error);
            if(error instanceof PlayerError){
                if(error.statusCode === 'InvalidTrack'){
                    await queue.destroy();
                    return interaction.followUp(`Não consegui achar isso 👉 **${query}**`);
                }
            }
            await queue.destroy();
            return interaction.followUp('Não rolou meu mano... 😿');
        }

        if(!result.playlist){
            return interaction.followUp(`Colocando este som 👉 **${result.tracks[0].title}** na fila, a pedidos de ${interaction.user} 😸`);
        } else {
            return interaction.followUp(`Colocando **${result.tracks.length}** sons desta playlist 👉 **${result.playlist.title}** na fila, a pedidos de ${interaction.user} 😸`);
        }        
	},
    emoji: '▶️',
};