
    const Discord = require('discord.js')
    const { load, endmsg, author, description } = require('../files/color.json')

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        if (message.deletable) message.delete();

        // filters out the messages to only the author
        const filter = msg => msg.author.id == message.author.id;
        var type = "", type_n1 = "", type_n2 = "", ctr = 1, c_size = 0;
        
        // sends an embed about the formatter and deletes after 30000ms (30s)
        const aufmEmbed = new Discord.MessageEmbed()
            .setAuthor("❱❱  R-Formatter 1.0", client.user.displayAvatarURL())
            .setDescription("> **Welcome to the R-Formatter 1.0.** This will create a new formatted catalog of your desired roles. To stop adding roles, type **'stop'**. This popup will disappear after **two minutes** of inactivity.")

            .addField("To start, enter you first role.", "Note: messages that do not contain a role or ID will stop the formatter.")
            .setFooter("Hyperspace Formatting", load)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
            .setColor(message.guild.me.displayHexColor)

            let aufm_wait = await message.channel.send(aufmEmbed);

        // collects all the messages sent and modifies them 
        const collector = new Discord.MessageCollector(message.channel, filter, { max:10, time: 120*1000 });
        collector.on('collect', m => {

            var rolename = m.guild.roles.cache.find(role => role.name === m.content);
            var roleid = message.guild.roles.cache.get(m.content);
            var t_msg = m.content;

            // if the message is "stop", it will stop collecting messages
            if (m.content == "stop") {
                m.delete();
                collector.stop();
            }
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
                    
                message.channel.send(valid).then(r => r.delete({timeout: 5*1000}));
                ctr++;
            }
            else {
                // anything else will result in an invalid output
                message.channel.send("Invalid input. Stopping rolemenu.").then(r => r.delete({timeout: 5*1000}));
                collector.stop();
            }
        });

        collector.on('end', collected => {

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
                
            c_size = collected.size;
            if (collected.size-1 == 0) 
                fnEmbed.addField("\u200b", "No roles to show.")
            // if there is only one role in the menu
            else if (collected.size-1 == 1) 
                fnEmbed.addField("Column 01", type_n1)
            // if there is more than one
            else {
                fnEmbed.addFields(
                    {name: "Column 01", value:type_n1, inline: true},
                    {name: "Column 02", value:type_n2, inline: true}
                )
            }

            fnEmbed.addField('\u200b', endmsg)
            message.channel.send(fnEmbed).then(msgg => {
            

            message.channel.send("Would you like to edit some parameters?").then(r => r.delete({timeout: 10*1000}))
            message.delete();

            // waits for a message to be sent, and then when collected, executes
            message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(collected => {

                var c_parameter = [ "author", "description", "color", "footer", "header", "filler"];
                var contents = "", ctr2 = 0;

                // if message is "cancel", process will stop
                if(collected.first().content == "yes" || collected.first().content == "y") {

                    var inst_msg = `**Enter your ${c_parameter[ctr2]} message.** [Type 'retain' to keep it the same, or 'empty' to clear out the field.]`;
                    message.channel.send(inst_msg).then(msg =>{
                            
                        const collectorParam = new Discord.MessageCollector(message.channel, filter, { max:5, time: 60*1000 });
                        collectorParam.on('collect', m => {
                            
                            if (ctr2 < 4) 
                                msg.edit(`**Enter your ${c_parameter[ctr2+1]} message.** [Type 'retain' to keep it the same, or 'empty' to clear out the field.]`);
                            else {
                                msg.edit(`Parameters added.`).then(r => r.delete({timeout: 3*1000}));
                            }

                            contents += m.content + "\n";
                            m.delete();
                            ctr2++;
                        });

                        collectorParam.on('end', collected => {
                            
                            // filters
                            cont_array = contents.split("\n");

                            // push
                            var header = "Column";
                            const fn_reembed = new Discord.MessageEmbed()
                                .setFooter("Hyperspace Formatting", load)
                                .setThumbnail(load)
                                .setTimestamp()

                            if (cont_array[0] == "retain") fn_reembed.setAuthor(author);
                            else if (cont_array[0] != "empty") fn_reembed.setAuthor(`❱❱  ${cont_array[0]}`);

                            if (cont_array[1] == "retain") fn_reembed.setDescription(description);
                            else if (cont_array[1] != "empty") fn_reembed.setDescription(cont_array[1]);

                            if (cont_array[2] == "retain") fn_reembed.setColor(message.guild.me.displayHexColor);
                            else if (cont_array[2] != "empty") fn_reembed.setColor(cont_array[2]);
                            else if (cont_array[2] == "empty") fn_reembed.setColor("#2f3136");

                            if (cont_array[4] == "empty") header = "/u200b";
                            else if (cont_array[4] != "empty") header = cont_array[4];

                            if (c_size-1 == 0) 
                                fn_reembed.addField("\u200b", "No roles to show.")
                            // if there is only one role in the menu
                            else if (c_size-1 == 1) 
                                fn_reembed.addField(`${header} 01`, type_n1)
                            // if there is more than one
                            else {
                                fn_reembed.addFields(
                                    {name: `${header} 01`, value:type_n1, inline: true},
                                    {name: `${header} 02`, value:type_n2, inline: true}
                                )
                            }

                            if (cont_array[3] == "retain") fn_reembed.addField('\u200b', endmsg);
                            else if (cont_array[3] != "empty") fn_reembed.addField('\u200b', cont_array[3]);

                            msgg.edit(fn_reembed);
  
                        });
                    
                    });
                }

                else if(collected.first().content == "no") 
                    return message.channel.send("Setup complete.").then(r => r.delete({timeout: 3*1000}));
                
                }).catch(err => {
                    console.log(err);
                });

                aufm_wait.delete();
            });
        });
    }

    module.exports.help = {
        name: "rfmt",
        aliases: ['rf']
    }

    // add support for custom prefix
    // add support for fnEmbed customization