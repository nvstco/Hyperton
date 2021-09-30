
    const Discord = require('discord.js')
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        if(message.deletable) message.delete();
        const { author, description, load, logo, endmsg } = require('../../resources/formats.json')

        const color_x = fs.readFileSync('./resources/colors.txt').toString().split('/');
        const hpEmbed = new Discord. MessageEmbed ()  
            .setAuthor(author)
            .setDescription(description)
            .addFields(
                {name: "Hues 01", value:color_x[0], inline: true},
                {name: "Hues 02", value:color_x[1], inline: true}
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
