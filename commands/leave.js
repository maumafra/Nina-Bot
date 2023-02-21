const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Faz eu sair do canal de voz.'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if(!queue){
            return await interaction.editReply('Não tem nada na fila... 🙀');
        }

        queue.destroy();
        await interaction.editReply('😾😾');
    },
    emoji: '😾',
}
