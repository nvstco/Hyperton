
    const Discord = require('discord.js');
    const fs = require('fs');

    module.exports.run = async (client, message, args) => {

        // checks if the user has the Tester role
        if(message.deletable) message.delete();
        const { load, logo } = require('../../resources/formats.json');

        // create two arrays for each column
        let h_01 = [], h_02 = [];
        // parses the colors.txt file into an array
        const roles_x = fs.readFileSync('./resources/roles.txt').toString().split('\n');

        // loops through the colors array
        for (let i = 0; i < roles_x.length; i++) {
            
            // format the role name with an arrow
            let r_name = `✦ ${roles_x[i].substring(0, roles_x[i].indexOf(':'))}`;
            // grab the actual role using the role name: r_name
            let role = message.guild.roles.cache.find(x => x.name === r_name);

            // grab the emote from the corresponding role name
            let e_name = roles_x[i].substring(roles_x[i].indexOf(":")+1, roles_x[i].length);

            // if the role does not exist, ignore
            if(role === undefined) {
                message.channel.send(`> Role ${r_name} does not exist.`).then(r => r.delete({timeout: 3*1000}));
            }
            else {
                // parses the first half into the left column
                if(i < roles_x.length/2) 
                    h_01.push(`> \`${('0'+(i+1)).slice(-2)}:\` ${e_name.trim()}  <@&${role.id}>`);
                // parses the second half into the right column
                else 
                    h_02.push(`> \`${('0'+(i+1)).slice(-2)}:\` ${e_name.trim()}  <@&${role.id}>`);
            }
        }
        
        // creates the final embed
        const hpEmbed = new Discord.MessageEmbed()  
            .setAuthor("Role Catalogue: Multiplayer Games")
            .setDescription("Feel free to react to the games where you want to be notified in whenever there is a game ongoing.")

            .addFields(
                {name: "C-01", value: h_01.toString().replace(/,/g, '\n'), inline: true},
                {name: "C-02", value: h_02.toString().replace(/,/g, '\n'), inline: true}
            )
            .addField('\u200b', "You may remove the role by unreacting.")

            .setColor(message.guild.me.displayHexColor)
                .setFooter("Hyperspace Formatting", load)
                .setThumbnail(logo)
                .setTimestamp()
        message.channel.send(hpEmbed);
    }

    module.exports.help = {
        name: "rrformat",
        aliases: ['rrf', 'rrfmt'],
        desc: "Creates a role embed with a specific emote."
    }
