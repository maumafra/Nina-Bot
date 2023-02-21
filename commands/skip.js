const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula uma música na fila.'),
	async execute(interaction, client) {
		await interaction.deferReply();
        const queue = client.player.getQueue(interaction.guildId);

        if(!queue){
            return await interaction.editReply('Não tem nada na fila... 🙀')
        }

        const currentSong = queue.current;

        queue.skip();

        return await interaction.editReply(`Por ordens de 👉 ${interaction.user}, o som **${currentSong.title}** foi de Indra... 💀`)
	},
	emoji: '⏭️',
};