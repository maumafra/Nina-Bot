//Esse deploy só registra os comandos, então apenas executá-lo em caso de alteração
//Para executá-lo -> node deploy-commands.js

const { REST, Routes } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

//Vai importar os comandos
const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

//Vai transformar a propriedade "data" em um JSON e adicionar no array
for (const file of commandFiles){
	const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

//Vai criar a instância do REST
const rest = new REST({ version:10 }).setToken(TOKEN);

//Vai fazer o deploy
(async() => {
    try{
        console.log(`Resetando ${commands.length} comandos...`);
        //PUT
        //Quando quiser fazer o deploy global, utilizar o Routes.applicationCommands(CLIENT_ID)
        //Quando quiser fazer o deploy para um único servidor, utilizar o Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
        await rest.put(
            //Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            Routes.applicationCommands(CLIENT_ID),
            {body: commands}
        );
        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error(error);
    }
})();