const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa o som'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if(!queue){
            return await interaction.editReply('NÃ£o tem nada na fila... ð');
        }

        queue.setPaused(true);
        await interaction.editReply(`Por ordens de ð ${interaction.user}, o som **${queue.current.title}** foi pausado... ð¸`);
    },
    emoji: 'â¸ï¸',
}
