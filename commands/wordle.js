const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wordleUtils = require('../utils/wordleUtils');

const game = {
	finished: false,
	win: false,
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
	return wordleUtils.usersInCooldown.includes(interaction.user.id);
}

function buildWord(word){
	let msg = '';
	for(const letter of word){
		if(letter === 0) msg+=('⬜ ');
		if(letter === 1) msg+=('🟨 ');
		if(letter === 2) msg+=('🟩 ');
		if(letter === 3) msg+=('✅ ');
	}
	return msg+='\n\n';
}

function buildGameMessage(){
	let msg = '';
	for(const word of game.tries.map){
		msg += buildWord(word);
	}
	if(msg === ''){
		msg = 'Alguma coisa deu errado. 😿';
		lose();
	}
	const attemptsEmbed = new EmbedBuilder()
		.setColor('Red')
		.setDescription(msg);
	return { embeds: [attemptsEmbed] };
}

function buildWinMessage(interaction) {
	let msg = `${interaction.user} acertou a palavra em ${game.tries.number} tentativas!\n\n\n`;
	for(let idx = 0; idx < game.tries.number; idx++){
		const word = game.tries.map[idx]
		msg += buildWord(word);
	}
	return msg;
}

function setColorAt (colorCode, index){
	game.tries.map[game.tries.number][index] = colorCode;
}

function isLetterGreen (word, letterIdx) {
	return word.toUpperCase()[letterIdx] === wordleUtils.word[letterIdx];
}

function isLetterYellow (letter, unmatchedLetters) {
	return unmatchedLetters[letter] && unmatchedLetters[letter] > 0;
}

function validateAttempt (word) {
	let numberOfChecks = 0;
	let unmatchedLetters = {};
	let letter;

	for(let idx = 0; idx < wordleUtils.word.length; idx++){
		letter = wordleUtils.word[idx];
		if(isLetterGreen(word, idx)){
			setColorAt(2, idx);
			numberOfChecks++;
		} else {
			unmatchedLetters[letter] = (unmatchedLetters[letter] || 0) + 1;
		}
	}

	for(let idx = 0; idx < word.length; idx++){
		letter = word.toUpperCase()[idx];
		if(!isLetterGreen(word, idx)){
			if(isLetterYellow(letter, unmatchedLetters)){
				setColorAt(1, idx);
				unmatchedLetters[letter]--;
			} else {
				setColorAt(0, idx);
			}
		}
	}

	if(numberOfChecks === 5) win();
}

function startGame(interaction){
	wordleUtils.usersInCooldown.push(interaction.user.id);

	interaction.user.createDM().then(async channel => {
		let lastBotMessage;

		lastBotMessage = await channel.send(buildGameMessage());
		//TODO: Colocar filtro pra só aceitar letras
		const filter = m => m.author.id === interaction.user.id && m.content.length === 5
		for(; game.tries.number < 6 && !game.finished; game.tries.number++){
			console.log(`Tentativa número ${game.tries.number+1}`);
			await channel.awaitMessages({ filter, max: 1, time: 120_000, errors: ['time'] })
				.then(async messages => {
					console.log(messages.first().content);
					validateAttempt(messages.first().content);
					lastBotMessage.delete();
					lastBotMessage = await channel.send(buildGameMessage());
				})
				.catch(error => {
					console.error(error);
					lose();
					if(error.size === 0){
						channel.send('Você demorou muito pra enviar sua tentativa... 😿');
					} else {
						channel.send('Alguma coisa deu errado. 😿');
					}
				});
		}
		if(game.win){
			const attemptsEmbed = new EmbedBuilder()
				.setColor('Green')
				.setDescription(buildWinMessage(interaction))
				.setTimestamp();
			interaction.followUp({ embeds: [attemptsEmbed] });
		}
	});
}

function executeCommand(interaction){
	if(isGameAlreadyDoneByUser(interaction)){
		interaction.reply('Você já jogou hoje! 😾');
		return;
	}
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