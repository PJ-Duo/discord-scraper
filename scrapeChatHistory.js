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


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    fetchAllMessages()
});


async function fetchAllMessages() {
    const channel = client.channels.cache.get("825224040641724416");

    // console.log(channel)
    let messages = [];

    // Create message pointer
    let message = await channel.messages.fetch({ limit: 1 }).then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

    while (message) {
        console.log(messages)
        if (messages.length < 50) {


            await channel.messages.fetch({ limit: 100, before: message.id }).then(messagePage => {
                //   messagePage.forEach(msg => messages.push(msg));
                messagePage.forEach(msg => {
                    if (msg.reference != null) {
                        messages.push({ answer: msg.content, qid: msg.reference.messageId })
                        //console.log(msg.reference.messageId)
                    }
                });
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        } else {
            break;
        }
    }


    console.log(messages[0].q.fetch());  // Print all messages
}


client.login(process.env.CLIENT_TOKEN);