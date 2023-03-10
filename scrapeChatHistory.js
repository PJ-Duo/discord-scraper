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

let q;
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
        // console.log(messages)
        if (messages.length < 4000000000000) {


            await channel.messages.fetch({ limit: 100, before: message.id }).then(messagePage => {

                for (let msg of messagePage) {
                    console.log(msg[1].content)

                    if (msg[1].reference != null) {
                        async function bruh() {
                            let q = await client.channels.cache.get("825224040641724416").messages.fetch(msg[1].reference.messageId)
                            console.log(q.content)
                            if (/[^a-zA-Z0-9\s]/g.test(q.content) == false && /[^a-zA-Z0-9\s]/g.test(msg[1].content) == false && q.content != "" && msg[1].content != "") {
                                fs.appendFile('./history.csv', `"${q.content}","${msg[1].content}"` + '\n', (err) => {
                                    if (err) throw err;
                                });
                            }
                        }

                        bruh()
                        messages.push({ answer: msg[1].content, qid: msg[1].reference.messageId })

                    }
                }

                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        } else {
            break;
        }
    }


}


client.login(process.env.CLIENT_TOKEN);