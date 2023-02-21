const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa o som'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if(!queue){
            return await interaction.editReply('Não tem nada na fila... 🙀');
        }

        queue.setPaused(true);
        await interaction.editReply(`Por ordens de 👉 ${interaction.user}, o som **${queue.current.title}** foi pausado... 😸`);
    },
    emoji: '⏸️',
}
