    
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        if(message.deletable) message.delete();
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;

        const colors = fs.readFileSync('./resources/colors.txt').toString().split('\n');
        const add_embed = new Discord.MessageEmbed()
            .setDescription(`\`📢\`   Adding roles...`)
            .setColor(`#2f3136`)

        message.channel.send(add_embed).then(msg => {
        message.guild.roles.create({
            data: { name: `── 𝙃𝙐𝙀`, color: `#FFFFFF`, permissions: [] }
        })
        
        colors.forEach(c => {

            let r_name = `⟶ ${c.substring(0, c.indexOf(':'))}`;
            if(!(message.guild.roles.cache.find(x => x.name === r_name) === undefined)) 
                return;
            
            message.guild.roles.create({
                data: {
                    name: r_name,
                    color: c.substring(c.indexOf('#')),
                    permissions: []
                }
            })
            
            const edit_embed = new Discord.MessageEmbed()
                .setDescription(`\`📢\`   Added role: **@${r_name.substring(1).trim()}**`)
                .setColor(`#2f3136`)

            msg.edit(edit_embed);
        })
            const final_embed = new Discord.MessageEmbed()
                .setDescription(`\`📢\`   Process complete.`)
                .setColor(`#2f3136`)

            msg.edit(final_embed)
                .then(r => r.delete({timeout: 3*1000}));
        });
    }

    module.exports.help = {
        name: "create",
        aliases: ['c']
    }
