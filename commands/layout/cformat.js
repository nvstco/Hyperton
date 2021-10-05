
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if(message.deletable) message.delete();
        const { author, description, load, logo, endmsg } = require('../../resources/formats.json');

        // create two arrays for each column
        let h_01 = [], h_02 = [];
        // parses the colors.txt file into an array
        const color_x = fs.readFileSync('./resources/colors.txt').toString().split('\n');

        // loops through the colors array
        for (let i = 0; i < color_x.length; i++) {
            
            // format the role name with an arrow
            let r_name = `⟶ ${color_x[i].substring(0, color_x[i].indexOf(':'))}`;
            // grab the actual role using the role name: r_name
            let role = message.guild.roles.cache.find(x => x.name === r_name);

            // if the role does not exist, ignore
            if(role === undefined) return;

            // parses the first half into the left column
            if(i < color_x.length/2) 
                h_01.push(`> \`${('0'+(i+1)).slice(-2)}:\` ✦ <@&${role.id}>`);
            // parses the second half into the right column
            else 
                h_02.push(`> \`${('0'+(i+1)).slice(-2)}:\` ✦ <@&${role.id}>`);
        }
        
        // creates the final embed
        const hpEmbed = new Discord.MessageEmbed()  
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
        aliases: ['colorcata', 'cc'],
        desc: "Creates a master embed containing roles made with the create command."
    }
