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
    fs.writeFile('./output/history.csv', '', function (err) {
        if (err) throw err;
    });
}

let q;
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    fetchAllMessages()
});


async function fetchAllMessages() {
    const channel = client.channels.cache.get("825224040641724416");

    let messages = [];
    let message;
    // Create message pointer
    if (fs.readFileSync('./index.txt', 'utf8') == "") {
        message = await channel.messages.fetch({ limit: 1 }).then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
    } else {
        message = JSON.parse(fs.readFileSync('./index.txt', 'utf8'));
    }


    while (message) {
        if (messages.length < 4000000000000) {


            await channel.messages.fetch({ limit: 100, before: message.id }).then(messagePage => {

                for (let msg of messagePage) {
                    //    console.log(msg[1].content)

                    if (msg[1].reference != null) {
                        async function bruh() {
                            let q = await client.channels.cache.get("825224040641724416").messages.fetch(msg[1].reference.messageId)
                            // console.log(q.content)
                            if (/[^a-zA-Z0-9\s]/g.test(q.content) == false && /[^a-zA-Z0-9\s]/g.test(msg[1].content) == false && q.content != "" && msg[1].content != "") {
                                fs.appendFile('./output/history.csv', `"${q.content}","${msg[1].content}"` + '\n', (err) => {
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
                fs.writeFileSync("./index.txt", JSON.stringify(message))
                message = JSON.parse(fs.readFileSync('./index.txt', 'utf8'));
            });
        } else {
            break;
        }
    }


}


client.login(process.env.CLIENT_TOKEN);