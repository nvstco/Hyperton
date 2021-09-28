
    const fs = require('fs');
    function load_commands(client) {

        // creates an array that will contain all the foldernames inside ./commands/
        const c_master = fs.readdirSync('./commands/')
        // loops through all the foldernames inside the c_master array
        for(let c_folder of c_master) {

            // creates an array that will contain all the filenames.js inside ./commands/c_folder/
            const c_files = fs.readdirSync(`./commands/${c_folder}`)
                .filter(file => file.endsWith('.js'));

            // (optional), if there are no filenames.js inside ./commands/c_folder/, log to console
            if(c_files.length <= 0) console.log(`  ❱❱ No ${c_folder} commands to load.`)
            console.log(`  ❱❱ Loading ${c_folder} commands...`)

            try {
                // loops through all files in c_files
                for (const file of c_files){

                    // require the actual file by using a path involving c_folder and files inside c_files
                    // note: require() has to be the exact filepath (regardless) to work
                    const command = require(`../commands/${c_folder}/${file}`);

                    // set the command to the client, given the command name (in module.exports), and the actual file
                    client.commands.set(command.help.name, command);

                    // loops through all the aliases (in module.exports) and sets them with the command name
                    command.help.aliases.forEach(alias => {
                        client.aliases.set(alias, command.help.name);
                    });
                }
            } catch(err) {
                console.log("  ❱❱ There was a problem in setting commands.\n\n", err);
            }

        }
    }

    module.exports = {
        load_commands
    }