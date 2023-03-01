const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wordleUtils = require('../utils/wordleUtils');
const time = require('../utils/time');
const logger = require('../utils/logger');

function getCooldown() {
	const timeRemaining = time.getTimeUntilMidnight(); 
	return `${Math.floor(timeRemaining/1000/60/60)}h, ${Math.floor(timeRemaining/1000/60%60)}min e ${Math.floor(timeRemaining/1000%60)}s`;
}

function executeCommand(interaction){
	const wordle = new WordleGame();
	if(wordle.isGameAlreadyDoneByUser(interaction)){
		interaction.reply(`Você já jogou hoje! 😾 Jogue de novo em ${getCooldown()}`);
		return;
	}
	interaction.reply("Olhe seu privado! 😼")
		.then(() => wordle.startGame(interaction));
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


class WordleGame{
	constructor(){
		this.game = {
			finished: false,
			win: false,
			tries: {
				number: 0,
				map: [ [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0] ]
			}
		}
	}
	
	lose(){
		this.game.finished = true;
		this.game.win = false;
	}
	
	win(){
		this.game.finished = true;
		this.game.win = true;
		this.game.tries.map[this.game.tries.number] = [3, 3, 3, 3, 3];
	}
	
	
	//TODO: Checar se o usuário já jogou no dia
	isGameAlreadyDoneByUser(interaction){
		return wordleUtils.usersInCooldown.includes(interaction.user.id);
	}
	
	buildWord(word){
		let msg = '';
		for(const letter of word){
			if(letter === 0) msg+=('⬜ ');
			if(letter === 1) msg+=('🟨 ');
			if(letter === 2) msg+=('🟩 ');
			if(letter === 3) msg+=('✅ ');
		}
		return msg+='\n\n';
	}
	
	buildGameMessage(){
		let msg = '';
		for(const word of this.game.tries.map){
			msg += this.buildWord(word);
		}
		if(msg === ''){
			msg = 'Alguma coisa deu errado. 😿';
			this.lose();
		}
		const attemptsEmbed = new EmbedBuilder()
			.setColor('Red')
			.setDescription(msg);
		return { embeds: [attemptsEmbed] };
	}
	
	buildWinMessage(interaction) {
		let msg = `${interaction.user} acertou a palavra em ${this.game.tries.number} tentativas!\n\n\n`;
		for(let idx = 0; idx < this.game.tries.number; idx++){
			const word = this.game.tries.map[idx]
			msg += this.buildWord(word);
		}
		return msg;
	}
	
	setColorAt (colorCode, index){
		this.game.tries.map[this.game.tries.number][index] = colorCode;
	}
	
	isLetterGreen (word, letterIdx) {
		return word.toUpperCase()[letterIdx] === wordleUtils.word[letterIdx];
	}
	
	isLetterYellow (letter, unmatchedLetters) {
		return unmatchedLetters[letter] && unmatchedLetters[letter] > 0;
	}
	
	validateAttempt (word) {
		let numberOfChecks = 0;
		let unmatchedLetters = {};
		let letter;
	
		for(let idx = 0; idx < wordleUtils.word.length; idx++){
			letter = wordleUtils.word[idx];
			if(this.isLetterGreen(word, idx)){
				this.setColorAt(2, idx);
				numberOfChecks++;
			} else {
				unmatchedLetters[letter] = (unmatchedLetters[letter] || 0) + 1;
			}
		}
	
		for(let idx = 0; idx < word.length; idx++){
			letter = word.toUpperCase()[idx];
			if(!this.isLetterGreen(word, idx)){
				if(this.isLetterYellow(letter, unmatchedLetters)){
					this.setColorAt(1, idx);
					unmatchedLetters[letter]--;
				} else {
					this.setColorAt(0, idx);
				}
			}
		}
	
		if(numberOfChecks === 5) this.win();
	}
	
	startGame(interaction){
		wordleUtils.usersInCooldown.push(interaction.user.id);
	
		interaction.user.createDM().then(async channel => {
			let lastBotMessage;
			try{
				lastBotMessage = await channel.send(this.buildGameMessage());
			} catch(error) {
				console.error(error);
				return interaction.followUp('Não consegui falar com você... 😿');
			}
			
			//TODO: Colocar filtro pra só aceitar letras
			const filter = m => m.author.id === interaction.user.id && m.content.length === 5
			for(; this.game.tries.number < 6 && !this.game.finished; this.game.tries.number++){
				logger.log(`(${interaction.guild.name}/${interaction.user.tag}) tentativa numero ${this.game.tries.number+1}`)
				await channel.awaitMessages({ filter, max: 1, time: 120_000, errors: ['time'] })
					.then(async messages => {
						logger.log(`(${interaction.guild.name}/${interaction.user.tag}) tentou ${messages.first().content}`)
						this.validateAttempt(messages.first().content);
						lastBotMessage.delete();
						lastBotMessage = await channel.send(this.buildGameMessage());
						messages.first().react(this.game.win ? '🙀' : '🤙');
					})
					.catch(error => {
						console.error(error);
						this.lose();
						if(error.size === 0){
							channel.send('Você demorou muito pra enviar sua tentativa... 😿');
						} else {
							channel.send('Alguma coisa deu errado. 😿');
						}
					});
			}
			if(this.game.win){
				const attemptsEmbed = new EmbedBuilder()
					.setColor('Green')
					.setDescription(this.buildWinMessage(interaction))
					.setTimestamp();
				interaction.followUp({ embeds: [attemptsEmbed] });
			}
		});
	}
}