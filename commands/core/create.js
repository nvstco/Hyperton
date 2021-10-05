    
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if(message.deletable) message.delete();
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;

        // warns if the user wants to proceed
        message.channel.send("Are you sure you want to create roles? Type 'yes' to proceed. `[Expires in 10s]`")
            .then(r => r.delete({timeout:10*1000}))
        const filter = msg => msg.author.id == message.author.id;

        // determines whether the process will continue or not
        message.channel.awaitMessages(filter, {max: 1, time: 10*1000}).then(collected => {
            try {

                // delete the message
                collected.first().delete();

                if(collected.first().content == "yes") {

                    // parses the colors.txt file into an array
                    const colors = fs.readFileSync('./resources/colors.txt').toString().split('\n');
                    // send an embed to start the process
                    const add_embed = new Discord.MessageEmbed()
                        .setDescription(`\`📢\`   Adding roles...`)
                        .setColor(`#2f3136`)
                    message.channel.send(add_embed).then(msg => {

                    // if there is no role named ── 𝙃𝙐𝙀, create one
                    if(message.guild.roles.cache.find(x => x.name === `── 𝙃𝙐𝙀`) === undefined) 
                        message.guild.roles.create({
                            data: { name: `── 𝙃𝙐𝙀`, color: `#FFFFFF`, permissions: [] }
                        });
                    
                    // loops through the colors array
                    colors.forEach(c => {

                        // format the role name with an arrow
                        let r_name = `⟶ ${c.substring(0, c.indexOf(':'))}`;
                        // if the role already exists, ignore
                        if(!(message.guild.roles.cache.find(x => x.name === r_name) === undefined)) 
                            return;
                        
                        // create the role, given the name and hex color
                        message.guild.roles.create({
                            data: {
                                name: r_name,
                                color: c.substring(c.indexOf('#')),
                                permissions: []
                            }
                        });
                        
                        // edits the embed to state that the role has been added
                        const edit_embed = new Discord.MessageEmbed()
                            .setDescription(`\`📢\`   Added role: **@${r_name.substring(1).trim()}**`)
                            .setColor(`#2f3136`)

                        msg.edit(edit_embed);
                    })
                        // self-deletes the embed once process has finished
                        const final_embed = new Discord.MessageEmbed()
                            .setDescription(`\`📢\`   Process complete.`)
                            .setColor(`#2f3136`)

                        msg.edit(final_embed)
                            .then(r => r.delete({timeout: 3*1000}));
                    });
                }
                else 
                    message.channel.send("Process cancelled.").then(r => r.delete({timeout: 5*1000}));
            } catch(err) {
                console.log("  ❱❱ No contents detected. \n\n", err)
            }
        });
    } 

    module.exports.help = {
        name: "create",
        aliases: ['c'],
        desc: "Creates 20 roles, each with a color. Support for custom colors soon."
    }
