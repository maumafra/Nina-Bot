//rodar o código -> node index.js
//ver o arquivo deploy-commands

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const dotenv = require('dotenv');

dotenv.config();

const { TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates] });

//Vai settar o player
client.player = new Player(client, {
	ytdlOptions:{
		filter: "audioonly",
		opusEncoded: true,
		quality: "highestaudio",
		highWaterMark: 1<<25
	}
});

//Vai importar os comandos
const fs = require('node:fs');
const path = require('node:path');
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Setta um novo item na Collection com a chave sendo o nome do comando e o valor aquilo que é exportado pelo módulo
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] O comando em ${filePath} está sem uma das propriedades: "data" ou "execute".`);
	}
}

//Logga o bot
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Logado como ${c.user.tag}`);
	client.user.setActivity('comida fora do pote');
	setDailyWord();
});

client.login(TOKEN);

//Handler dos Comandos
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'Ocorreu um erro ao tentar executar esse comando!', ephemeral: true });
	}
});

//Aviso da música atual
client.player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎵 Tocando o som **${track.title}**( ${track.url} )!`));

//Execução diária
const wordle = require('./utils/wordleUtils');
const time = require('./utils/time');
const logger = require('./utils/logger');

const setDailyWord = () => {
	wordle.word = wordle.words[Math.floor(Math.random() * wordle.words.length)];
	logger.log(`Wordle: A palavra do dia é ${wordle.word}!`);
	wordle.usersInCooldown = [];
}

setTimeout(() => {
	//roda a primeira vez
	setDailyWord();
	//24*60*60*1000 = 86400000, ou seja 86400000ms === 24h
	setInterval(setDailyWord, 86400000);
}, time.getTimeUntilMidnight());



//teste
//client.player.on("trackEnd", (queue, track) => console.log(`Fim do som **${track.title}**!`))