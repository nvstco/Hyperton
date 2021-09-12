
    const Discord = require('discord.js')
    const { load, logo, endmsg, author, description } = require('../files/color.json')
    module.exports.run = async (client, message, args) => {

        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        if (message.deletable) message.delete();
        
        // filters out the messages to only the author
        const filter = msg => msg.author.id == message.author.id;
        var type = "", type_n1 = "", type_n2 = "", ctr = 1;
        
        // sends an embed and deletes after 30000ms (30s)
        const aufmEmbed = new Discord.MessageEmbed()
            .setAuthor("❱❱  R-Formatter 1.0", client.user.displayAvatarURL())
            .setDescription("> **Welcome to the R-Formatter 1.0.** This will create a new formatted embed of your desired roles. To stop adding roles, type **'end'**. This popup will disappear after **two minutes** of inactivity.")

            .addField("To start, enter you first role.", "Note: messages that do not contain a role or ID will stop the formatter.")

            .setFooter("Hyperspace Formatting", load)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
            .setColor(message.guild.me.displayHexColor)
            message.channel.send(aufmEmbed).then(r => r.delete({timeout: 30000}));

        // collects all the messages sent and modifies them to store in type
        const collector = new Discord.MessageCollector(message.channel, filter, { max:10, time: 120000 });
        collector.on('collect', m => {

            if (m.content == "end") collector.stop();
            else if (m.mentions.roles.first()){
                
                if(m.deletable) m.delete();
                type += `> \`0${ctr}:\` ✦ ${m.content} \n`;
                var valid = new Discord.MessageEmbed()
                    .setDescription(`**📢  Successfully added role #${ctr}:** ${m.content}`)
                    .setColor("2f3136")
                message.channel.send(valid).then(r => r.delete({timeout: 5000}));;
                ctr++;
            }
            else {
                message.channel.send("Invalid input. Stopping rolemenu.") 
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if(collected.size <= 0) 
                message.channel.send("Action complete.").then(r => r.delete({timeout: 3000}));
            
            type_array = type.split("\n");
            for (i = 0; i<type_array.length; i++) {
                if (i+1 <= (type_array.length/2)) 
                    type_n1 += type_array[i] + "\n";
                else type_n2 += type_array[i] + "\n";
            }

            try {
            const fnEmbed = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)

                .addFields(
                    {name: "Hues 01", value:type_n1, inline: true},
                    {name: "Hues 02", value:type_n2, inline: true}
                )
                .addField('\u200b', endmsg)

                .setColor(message.guild.me.displayHexColor)
                    .setFooter("Hyperspace Formatting", load)
                    .setThumbnail(load)
                .setTimestamp()
                message.channel.send(fnEmbed);

            } catch(err) {
                console.log(err);
            }
        });
    
    }

    module.exports.help = {
        name: "rfmt",
        aliases: ['rf']
    }

    // add support for custom prefix
    // add support for fnEmbed customization