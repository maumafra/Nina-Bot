const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const words = ['AMIGO', 'PONTO', 'CINCO', 'TERMO', 'VIGOR', 'IDEIA', 'PODER',
 'MORAL', 'TEMPO', 'CORPO' , 'PORCO', 'OSTRA', 'REGRA', 'AUDIO' , 'MIDIA', 
 'NOTAS' , 'PEDRA', 'MEDIA']

const game = {
	finished: false,
	win: false,
	word: words[2], //trocar dps
	tries: {
		number: 0,
		map: [ [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0] ]
	}
}

function lose(){
	game.finished = true;
	game.win = false;
}

function win(){
	game.finished = true;
	game.win = true;
	game.tries.map[game.tries.number] = [3, 3, 3, 3, 3];
}


//TODO: Checar se o usuário já jogou no dia
function isGameAlreadyDoneByUser(interaction){
	return false;
}

function sendLettersMap(channel){
	let msg = '';
	for(const word of game.tries.map){
		for(const letter of word){
			if(letter === 0) msg+=('⬜ ');
			if(letter === 1) msg+=('🟨 ');
			if(letter === 2) msg+=('🟩 ');
			if(letter === 3) msg+=('✅ ');
		}
		msg+='\n\n'
	}
	if(msg === '') msg = 'Alguma coisa deu errado. 😿';
	const attemptsEmbed = new EmbedBuilder()
		.setColor('Red')
		.setDescription(msg);
	return channel.send({ embeds: [attemptsEmbed] });
}

function setColorAt (colorCode, index){
	game.tries.map[game.tries.number][index] = colorCode;
}

function isLetterGreen (letter, letterIdx) {
	return letter === game.word[letterIdx];
}

function isLetterYellow (letter, letterIdx) {
	let nextIdx = letterIdx;
	for(let i = 0; i < 4; i++){
		nextIdx = (nextIdx+1)%5;
		if(letter === game.word[nextIdx]){
			return true;
		}
	}
	return false;
}

function validateAttempt (word) {
	let numberOfChecks = 0;
	for(const letterIdx in word){
		const letter = word.toUpperCase()[letterIdx];

		if(isLetterGreen(letter, letterIdx)){
			setColorAt(2, letterIdx);
			numberOfChecks++;
		} else if (isLetterYellow(letter, letterIdx)) {
			setColorAt(1, letterIdx);
		} else {
			setColorAt(0, letterIdx);
		}
	}
	if(numberOfChecks == 5){
		win();
	}
}

function startGame(interaction){
	if(isGameAlreadyDoneByUser(interaction)){
		interaction.reply('Você já jogou hoje! 😾');
		return;
	}
	interaction.user.createDM().then(async channel => {
		let lastBotMessage;

		lastBotMessage = await sendLettersMap(channel);
		//TODO: Colocar filtro pra só aceitar letras
		const filter = m => m.author.id === interaction.user.id && m.content.length === 5
		for(; game.tries.number < 6 && !game.finished; game.tries.number++){
			console.log(`TENTATIVA NUMERO ${game.tries.number+1}`);
			await channel.awaitMessages({ filter, max: 1, time: 120_000, errors: ['time'] })
				.then(async messages => {
					console.log(messages.first().content);
					validateAttempt(messages.first().content);
					lastBotMessage.delete();
					lastBotMessage = await sendLettersMap(channel);
				})
				.catch(error => {
					console.error(error);
					lose();
					if(error.size === 0){
						channel.send('Você demorou muito pra enviar sua tentativa... 😿');
					} else {
						channel.send('Alguma coisa deu errado. 😿');
					}
					
				})
		}
	})
}

function executeCommand(interaction){
	interaction.reply("Olhe seu privado! 😼")
		.then(() => startGame(interaction));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription("Tente adivinhar a palavra para conquistar pontos."),
	execute(interaction) {
		executeCommand(interaction);
	},
	emoji: '🔤',
};