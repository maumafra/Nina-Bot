const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Faz eu sair do canal de voz.'),
    async execute(interaction, client) {
        await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if(!queue){
            return await interaction.editReply('NÃ£o tem nada na fila... ð');
        }

        queue.destroy();
        await interaction.editReply('ð¾ð¾');
    },
    emoji: 'ð¾',
}
