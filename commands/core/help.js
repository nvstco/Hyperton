
    const Discord = require('discord.js');
    const fs = require('fs');

    const { prefix } = require('../../extensions/preferences.json');
    const { load } = require('../../resources/formats.json')

    module.exports.run = async (client, message, args) => {
        
        // initialize the help embed
        const hp_embed = new Discord.MessageEmbed()
            .setAuthor("Recursion Commands", load)
            .setDescription(`The prefix for this server is \`${prefix}\`. Note that all commands are experimental and few do not work efficiently as of the moment.`)

            .setColor(message.guild.me.displayHexColor)
            .setFooter(`Requested by ${message.author.username}.`, message.author.avatarURL())
            .setThumbnail(message.guild.iconURL())
            .setTimestamp()

        // creates an array that will contain all the foldernames inside ./commands/
        const c_master = fs.readdirSync('./commands/')
        // loops through all the foldernames inside the c_master array
        for(let c_folder of c_master) {

            // creates a string that will hold the commands
            let cmd_list = "";

            // creates an array that will contain all the filenames.js inside ./commands/c_folder/
            const c_files = fs.readdirSync(`./commands/${c_folder}`)
                .filter(file => file.endsWith('.js'));

            try {
                // loops through all files in c_files
                for (const file of c_files){

                    // require the actual file by using a path involving c_folder and files inside c_files
                    // note: require() has to be the exact filepath (regardless) to work
                    const command = require(`../../commands/${c_folder}/${file}`);

                    // format the name, aliases and description into a string, then pushed into the cmd_list
                    cmd_list += `\`${prefix + command.help.name}\` | \`${(command.help.aliases).toString().replace(/,/g, '`, `')}\` \n`;
                    cmd_list += `\`🤖\` ${command.help.desc} \n\n`
                }
            } catch(err) {
                console.log("  ❱❱ There was a problem in parsing commands.\n\n", err);
            }

            // add a field for each category, contianing the cmd_list
            hp_embed.addField(`\u200b`, cmd_list, true);
        }

        // send the final embed
        message.channel.send(hp_embed);
    }

    module.exports.help = {
        name: "help",
        aliases: ['h', 'commands', 'cmd'],
        desc: "Displays all the commands supported by the bot, alongside a description."
    }