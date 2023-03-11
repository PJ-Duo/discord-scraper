require('dotenv').config();
const fs = require('fs');
const pattern = /[^a-zA-Z]/;

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

if (!fs.existsSync('./output/data.csv')) {
    fs.writeFile('./output/data.csv', '', function (err) {
        if (err) throw err;
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    //   console.log()
    if (pattern.test(message.content) === false) { //filter special charectors
        if (message.reference != null) {
            const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
            console.log(message.reference)
            console.log(repliedTo.content, message.content);
            if (repliedTo.content != "" && message.content != "") { // if both are not empty write to data
                fs.appendFile('./output/data.csv', `"${repliedTo.content}","${message.content}"` + '\n', (err) => {
                    if (err) throw err;
                });
            }
        }
    }
});

client.login(process.env.CLIENT_TOKEN);