    
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if(message.deletable) message.delete();
        if (!(message.member.roles.cache.some(role => role.name === 'Tester'))) return;
        
        // parses the colors.txt file into an array
        const colors = fs.readFileSync('./resources/colors.txt').toString().split('\n');
        // send an embed to start the process
        const del_embed = new Discord.MessageEmbed()
            .setDescription(`\`📢\`   Deleting roles...`)
            .setColor(`#2f3136`)
        message.channel.send(del_embed).then(msg => {
        
        // if there is a role named ── 𝙃𝙐𝙀, delete it
        let h_role = message.guild.roles.cache.find(x => x.name === `── 𝙃𝙐𝙀`);
        if(h_role !== undefined) h_role.delete();
        
        // loops through the colors array
        colors.forEach(c => {

            // format the role name with an arrow
            let r_name = `⟶ ${c.substring(0, c.indexOf(':'))}`;
            // grab the actual role using the role name: r_name
            let role = message.guild.roles.cache.find(x => x.name === r_name);

            // if the role does not exist, ignore. otherwise, delete it
            if(role === undefined) return;
            role.delete();

            // edits the embed to state that the role has been added
            const edit_embed = new Discord.MessageEmbed()
                .setDescription(`\`📢\`   Deleted role: **@${r_name.substring(1).trim()}**`)
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

    module.exports.help = {
        name: "delete",
        aliases: ['del']
    }