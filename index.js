const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const prefix = "-";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
console.log('');

client.on('ready', ()=>{

    console.log('  ❱❱ Online.');
    client.user.setActivity("on air", {
        type: "STREAMING",
        url: "https://www.twitch.tv/monstercat"
      });
})

    const fs = require('fs');
    client.commands = new Collection();
    client.aliases = new Collection()

    const command_f = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    if(command_f.length <= 0) console.log("  ❱❱ No commands to load.")

    console.log("  ❱❱ Loading commands...")
    try{
        for (const file of command_f){
            const command = require(`./commands/${file}`);
            client.commands.set(command.help.name, command);

            command.help.aliases.forEach(alias => {
                client.aliases.set(alias, command.help.name);
            });
        }
    } catch(err) {
        console.log(err)
    }

client.on('message', async message=>{

    const args = message.content.substring(prefix.length).split(" ")

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    
    let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    if(cmd) cmd.run(client, message, args.slice(1));
    
})

client.login(token);

