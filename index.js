    
    const { Client, Collection, Intents } = require('discord.js');
    const { token } = require('./config.json');
    const { prefix } = require('./extensions/preferences.json');

    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    console.log('');

    client.on('ready', ()=>{

        console.log('\n  ❱❱ Online.  \n');
        client.user.setActivity("on air", {
            type: "STREAMING",
            url: "https://www.twitch.tv/monstercat"
        });
    })

        client.commands = new Collection();
        client.aliases = new Collection()

        const { load_commands } = require('./extensions/load_commands');
        load_commands(client);

    client.on('message', async message=>{

        const args = message.content.substring(prefix.length).split(" ")

        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(prefix)) return;
        
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if(cmd) cmd.run(client, message, args.slice(1));
        
    })

    client.login(token);

