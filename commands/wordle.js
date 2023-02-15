const { SlashCommandBuilder } = require('discord.js');

const words = ['AMIGO', 'PONTO', 'CINCO', 'TERMO', 'VIGOR', 'IDEIA', 'PODER',
 'MORAL', 'TEMPO', 'CORPO' , 'PORCO', 'OSTRA', 'REGRA', 'AUDIO' , 'MIDIA', 
 'NOTAS' , 'PEDRA', 'MEDIA']

const game = {
	finished: false,
	win: false,
	word: '',
	tries: {
		number: 0,
		map: [ [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0] ]
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription("Tente adivinhar a palavra para conquistar pontos."),
	execute(interaction) {
		interaction.reply({ content: "Olhe seu privado! 😼", ephemeral: true })
			.then(() => interaction.user.send('WIP 🙀'))
			.then(() => {
				interaction.user.createDM().then(channel => {
					channel.send('⬜ ⬜ ⬜ ⬜ ⬜\n🟨 🟨 🟨 🟨 🟨')

					const filter = m => m.author.id === interaction.user.id
					channel.awaitMessages({ filter, max: 1, time: 120_000, errors: ['time'] })
						.then(messages => console.log(messages.first().content))
						.catch(error => {
							console.error(error);
							channel.send('Você demorou muito pra enviar sua tentativa... 😿')
						})
				})
			});
	},
	emoji: '🔤',
};