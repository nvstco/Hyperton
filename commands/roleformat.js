
    const Discord = require('discord.js')
    const { load, logo, endmsg, author, description } = require('../files/color.json')
    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        if (message.deletable) message.delete();

        // filters out the messages to only the author
        const filter = msg => msg.author.id == message.author.id;
        var type = "", type_n1 = "", type_n2 = "", ctr = 1;
        
        // sends an embed about the formatter and deletes after 30000ms (30s)
        const aufmEmbed = new Discord.MessageEmbed()
            .setAuthor("❱❱  R-Formatter 1.0", client.user.displayAvatarURL())
            .setDescription("> **Welcome to the R-Formatter 1.0.** This will create a new formatted embed of your desired roles. To stop adding roles, type **'stop'**. This popup will disappear after **two minutes** of inactivity.")

            .addField("To start, enter you first role.", "Note: messages that do not contain a role or ID will stop the formatter.")
            .setFooter("Hyperspace Formatting", load)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
            .setColor(message.guild.me.displayHexColor)

            message.channel.send(aufmEmbed).then(r => r.delete({timeout: 20*1000}));

        // collects all the messages sent and modifies them 
        const collector = new Discord.MessageCollector(message.channel, filter, { max:10, time: 120*1000 });
        collector.on('collect', m => {

            var rolename = m.guild.roles.cache.find(role => role.name === m.content);
            var roleid = message.guild.roles.cache.get(m.content);
            var t_msg = m.content;

            // if the message is "stop", it will stop collecting messages
            if (m.content == "stop") collector.stop();
            // if the message contains a role, the role name, or the id
            else if (m.mentions.roles.first() || rolename != undefined || roleid){
                
                // checks if user provided a role name
                if(rolename != undefined) t_msg = `<@&${rolename.id}>`;
                // checks if user provided a role id
                if(roleid) t_msg = roleid;
                
                if(m.deletable) m.delete();
                // formats the message with a stylized prefix and counter
                type += `> \`${('0'+ctr).slice(-2)}:\` ✦ ${t_msg} \n`;
                // creates an embed that will reply if the role has been added
                var valid = new Discord.MessageEmbed()
                    .setDescription(`**📢  Successfully added role #${ctr}:** ${t_msg}`)
                    .setColor("2f3136")
                    
                message.channel.send(valid).then(r => r.delete({timeout: 5*1000}));;
                ctr++;
            }
            else {
                // anything else will result in an invalid output
                message.channel.send("Invalid input. Stopping rolemenu.") 
                collector.stop();
            }
        });

        collector.on('end', collected => {
            message.channel.send("Action complete.").then(r => r.delete({timeout: 3*1000}));
            
            // splits type into an array
            type_array = type.split("\n");
            // for loop to split type_array into two columns
            for (i = 0; i<type_array.length; i++) {
                if (i+1 <= (type_array.length/2)) 
                    type_n1 += type_array[i] + "\n";
                else type_n2 += type_array[i] + "\n";
            }

            // creates the final embed that will house everything
            const fnEmbed = new Discord.MessageEmbed()
                .setAuthor(author)
                .setDescription(description)

                .setColor(message.guild.me.displayHexColor)
                    .setFooter("Hyperspace Formatting", load)
                    .setThumbnail(load)
                .setTimestamp()
                
            // if there is only one role in the menu
            if (collected.size-1 == 1) 
                fnEmbed.addField("Hues 01", type_n1)
            // if there is more than one
            else {
                fnEmbed.addFields(
                    {name: "Hues 01", value:type_n1, inline: true},
                    {name: "Hues 02", value:type_n2, inline: true}
                )
            }

            fnEmbed.addField('\u200b', endmsg)
            message.channel.send(fnEmbed);
        });
    
    }

    module.exports.help = {
        name: "rfmt",
        aliases: ['rf']
    }

    // add support for custom prefix
    // add support for fnEmbed customization