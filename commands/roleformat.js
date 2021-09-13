
    const Discord = require('discord.js')
    const { load, endmsg, author, description } = require('../files/color.json')

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        if (message.deletable) message.delete();

        // filters out the messages to only the author
        const filter = msg => msg.author.id == message.author.id;
        var type = "", type_n1 = "", type_n2 = "", ctr = 1, c_size = 0, acc = true;
        
        // sends an embed about the formatter and deletes after 30000ms (30s)
        const aufmEmbed = new Discord.MessageEmbed()
            .setAuthor("❱❱  R-Formatter 1.0", client.user.displayAvatarURL())
            .setDescription("**Welcome to the R-Formatter 1.0.** This will create a new formatted catalog of your desired roles. The formatter will continue to listen for input, unless you type **'stop'**. This popup will disappear after **two minutes** of inactivity.")

            .addField("To start, enter a role name, an ID, or simply tag the role.", "Note: messages that do not contain a role or ID will stop the formatter.")
            .setFooter("Hyperspace Formatting", load)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
            .setColor(message.guild.me.displayHexColor)

        // wait until the entire process is finished to delete the embed
        let aufm_wait = await message.channel.send(aufmEmbed);

        // collects all the messages sent and modifies them for the role section
        const collector = new Discord.MessageCollector(message.channel, filter, { max:10, time: 120*1000 });
        collector.on('collect', m => {

            // check if the message sent is an existing role
            var rolename = m.guild.roles.cache.find(role => role.name === m.content);
            var roleid = message.guild.roles.cache.get(m.content);
            var t_msg = m.content;

            // if the message is "stop", the collector will stop collecting messages
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
                    .setColor("2f3136");
                message.channel.send(valid).then(r => r.delete({timeout: 3*1000}));
                ctr++;
            }
            else {
                // anything else will result in an invalid output
                message.channel.send("Invalid input. Stopping rolemenu.").then(r => r.delete({timeout: 5*1000}));
                acc = false;
                collector.stop();
            }
        });

        // once the collector finished collecting messages
        collector.on('end', collected => {

            if (!acc) return;

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
                
            // defines the size to be used for modification later on
            c_size = collected.size;

            // if there are no roles in the menu
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

            // sends the embed, but asks for modifications (if any)
            message.channel.send(fnEmbed).then(msgg => {
            
            // inform to add parameters, then delete user message immediately afterwards
            message.channel.send("> **Would you like to edit the information?** [Type 'yes' or 'no' to answer.] [This popup will delete itself after 10s.]")
                .then(r => r.delete({timeout: 10*1000}))

            // waits for a message to be sent, and then when collected, executes
            message.channel.awaitMessages(filter, {max: 1, time: 10*1000}).then(collected => {

                // parameters to be edited in 
                var c_parameter = [ "author", "description", "color hex", "header", "footer", "filler"];
                var contents = "", ctr2 = 0;

                // get the id of the collected message, and deletes it after 3 seconds.
                message.channel.messages.fetch(collected.first().id).then(msg => msg.delete({timeout: 3*1000}));

                try {
                // if the message sent is yes, execute
                if(collected.first().content == "yes" || collected.first().content == "y") {

                    collected.delete();
                    // prepares the message to be sent, with the parameters inside
                    var inst_msg = `**Enter your ${c_parameter[ctr2]} message.** [Type 'retain' to keep it the same, or 'empty' to clear out the field.]`;
                    // sends the message, but waits for input for modifications
                    message.channel.send(inst_msg).then(msg =>{
                        
                        // collects all the messages sent and modifies them for the params section
                        const collectorParam = new Discord.MessageCollector(message.channel, filter, { max:5, time: 120*1000 });
                        collectorParam.on('collect', m => {
                            
                            // fixes showing the "filler" text when the message gets edited.
                            if (ctr2 < 4) 
                                msg.edit(`**Enter your ${c_parameter[ctr2+1]} message.** [Type 'retain' to keep it the same, or 'empty' to clear out the field.]`);
                            else {
                                msg.edit(`Modifications complete.`).then(r => r.delete({timeout: 3*1000}));
                            }

                            // concatenates the content into a single string, to be filtered later on.
                            contents += m.content + "\n";
                            m.delete();
                            ctr2++;
                        });

                        // once the collector finishes collecting messages
                        collectorParam.on('end', collected => {
                            
                            // splits the content into an array
                            cont_array = contents.split("\n");
                            var header = "Column";

                            // creates the new embed to be edited.
                            const fn_reembed = new Discord.MessageEmbed()
                                .setFooter("Hyperspace Formatting", load)
                                .setThumbnail(load)
                                .setTimestamp()

                            // checks if the author section has modifications
                            if (cont_array[0] == "retain") fn_reembed.setAuthor(author);
                            else if (cont_array[0] != "empty") fn_reembed.setAuthor(`❱❱  ${cont_array[0]}`);

                            // checks if the description section has modifications
                            if (cont_array[1] == "retain") fn_reembed.setDescription(description);
                            else if (cont_array[1] != "empty") fn_reembed.setDescription(cont_array[1]);

                            // checks if the color hex section has modifications
                            if (cont_array[2] == "retain") fn_reembed.setColor(message.guild.me.displayHexColor);
                            else if (cont_array[2] != "empty") fn_reembed.setColor(cont_array[2]);
                            else if (cont_array[2] == "empty") fn_reembed.setColor("#2f3136");

                            // checks if the header section has modifications
                            if (cont_array[3] == "empty") header = " ";
                            else if (cont_array[3] != "empty") header = cont_array[4];

                            // utilizing c-size and type as global variables, to be inserted into the new embed
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

                            // checks if the footer section has modifications
                            if (cont_array[4] == "retain") fn_reembed.addField('\u200b', endmsg);
                            else if (cont_array[4] != "empty") fn_reembed.addField('\u200b', cont_array[3]);

                            // edits the embed into a new one with modifications, and deletes the first message.
                            msgg.edit(fn_reembed);
                            aufm_wait.delete();

                            message.channel.send("> Format setup complete. [This message will delete itself after 5 seconds.]")
                                .then(r => r.delete({timeout: 5*1000}))
                        });
                    });
                }
                } catch(err) {
                    console.log("No input.");
                }

                // if the message sent is no, stop the command.
                if(collected.first().content == "no" || collected.first().content == "n") {
                    message.channel.send("> Format setup complete. [This message will delete itself after 5 seconds.]")
                        .then(r => r.delete({timeout: 5*1000}))
                    aufm_wait.delete();
                }

            // catches the error and logs it in.
            }).catch(err => {
                    console.log(err);
                });
            });
        });
    }

    module.exports.help = {
        name: "rfmt",
        aliases: ['rf']
    }