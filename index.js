//rodar o código -> node index.js
//ver o arquivo deploy-commands

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const { TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages] });

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
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Ocorreu um erro ao tentar executar esse comando!', ephemeral: true });
	}
});