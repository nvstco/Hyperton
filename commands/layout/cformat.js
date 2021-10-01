
    const Discord = require('discord.js')
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        if(message.deletable) message.delete();
        const { author, description, load, logo, endmsg } = require('../../resources/formats.json')

        let h_01 = [], h_02 = [];
        const color_x = fs.readFileSync('./resources/colors.txt').toString().split('\n');

        for (let i = 0; i < color_x.length; i++) {
            
            let r_name = `⟶ ${color_x[i].substring(0, color_x[i].indexOf(':'))}`
            let role = message.guild.roles.cache.find(x => x.name === r_name);

            if(role === undefined) return;

            if(i < color_x.length/2) 
                h_01.push(`> \`${('0'+(i+1)).slice(-2)}:\` ✦ <@&${role.id}>`)

            else 
                h_02.push(`> \`${('0'+(i+1)).slice(-2)}:\` ✦ <@&${role.id}>`)
            
        }
        
        const hpEmbed = new Discord. MessageEmbed ()  
            .setAuthor(author)
            .setDescription(description)

            .addFields(
                {name: "Hues 01", value: h_01.toString().replace(/,/g, '\n'), inline: true},
                {name: "Hues 02", value: h_02.toString().replace(/,/g, '\n'), inline: true}
            )
            .addField('\u200b', endmsg)

            .setColor(message.guild.me.displayHexColor)
                .setFooter("Hyperspace Formatting", load)
                .setThumbnail(logo)
                .setTimestamp()

        message.channel.send(hpEmbed);
    }

    module.exports.help = {
        name: "cformat",
        aliases: ['colorcata', 'cc']
    }
