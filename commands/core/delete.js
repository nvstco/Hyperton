    
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        if(message.deletable) message.delete();
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        
        const colors = fs.readFileSync('./resources/colors.txt').toString().split('\n');
        const del_embed = new Discord.MessageEmbed()
            .setDescription(`\`📢\`   Deleting roles...`)
            .setColor(`#2f3136`)

        message.channel.send(del_embed).then(msg => {

        let h_role = message.guild.roles.cache.find(x => x.name === `── 𝙃𝙐𝙀`);
        if(h_role !== undefined) h_role.delete();
        
        colors.forEach(c => {

            let r_name = `⟶ ${c.substring(0, c.indexOf(':'))}`;
            let role = message.guild.roles.cache.find(x => x.name === r_name);

            if(role === undefined) return;
            role.delete();
            
            const edit_embed = new Discord.MessageEmbed()
                .setDescription(`\`📢\`   Deleted role: **@${r_name.substring(1).trim()}**`)
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
        name: "delete",
        aliases: ['del']
    }