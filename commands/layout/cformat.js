
    const Discord = require('discord.js')
    module.exports.run = async (client, message, args) => {

        if(message.deletable) message.delete();
        const { author, description, load, logo, endmsg } = require('../../resources/color.json')

        const { c_cloud, c_wheat, c_salmon, c_crimson, c_burgundy, c_indigo, c_phtalo, c_seagreen, c_teal, c_moss } = require('../../resources/color.json')
        var color_a = `${c_cloud}${c_wheat}${c_salmon}${c_crimson}${c_burgundy}${c_indigo}${c_phtalo}${c_seagreen}${c_teal}${c_moss}`;

        const { c_gold, c_bronze, c_magenta, c_lavender, c_periwinkle, c_purple, c_azure, c_condense, c_smoke, c_marsblack } = require('../../resources/color.json')
        var color_b = `${c_gold}${c_bronze}${c_magenta}${c_lavender}${c_periwinkle}${c_purple}${c_azure}${c_condense}${c_smoke}${c_marsblack}`;

        const hpEmbed = new Discord. MessageEmbed ()  
            .setAuthor(author)
            .setDescription(description)
            .addFields(
                {name: "Hues 01", value:color_a, inline: true},
                {name: "Hues 02", value:color_b, inline: true}
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
