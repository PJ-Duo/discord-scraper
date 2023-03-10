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
        if (messages.length < 40) {


            await channel.messages.fetch({ limit: 100, before: message.id }).then(messagePage => {
                //   messagePage.forEach(msg => messages.push(msg));
               /* messagePage.forEach(msg => {
                    if (msg.reference != null) {
                        messages.push({ answer: msg.content, qid: msg.reference.messageId })
                        //console.log(msg.reference.messageId)
                    }
                }); */
             //   console.log(typeof messagePage)
                for ( let msg of messagePage) {
                    console.log(msg[1].content)
               
                    if (msg[1].reference != null) {
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


    for (i = 0; i < messages.length; i++) {
        q = await client.channels.cache.get("825224040641724416").messages.fetch(messages[i].qid)
        if (/[^a-zA-Z0-9\s]/g.test(q.content) == false && /[^a-zA-Z0-9\s]/g.test(messages[i].answer) == false && q.content != "" && messages[i].answer != "") {
            fs.appendFile('./history.csv', `"${q.content}","${messages[i].answer}"` + '\n', (err) => {
                if (err) throw err;
            });
        }
    }
}


client.login(process.env.CLIENT_TOKEN);