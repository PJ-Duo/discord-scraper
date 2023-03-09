require('dotenv').config();
const fs = require('fs');

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.reference != null) {
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        console.log(message.reference)
        console.log(repliedTo.content, message.content);

        fs.appendFile('./data.csv', `"${repliedTo.content}","${message.content}"` + '\n', (err) => {
            if (err) throw err;
        });

    }


});

// create an object to write to the file
client.login(process.env.CLIENT_TOKEN);