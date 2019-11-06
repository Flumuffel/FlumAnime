const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs =require('fs')
const botconfig = require('./botconfig.json')
let cooldown = new Set()
let cdseconds = 5

const client = new Client({
    disableEveryone: true
})

//Music
const active = new Map()

//Optionen
let ops = {
    ownerID: 274209471968837634,
    active: active
}

// Collections
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/")

config({
    path: __dirname + "/.env"
});

// Run the command loader
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "me getting developed",
            type: "WATCHING"
        }
    }); 
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (oldMember.voiceChannelID && oldMember.user.tag == client.user.tag) return ops.active.delete(oldMember.guild.id)
})

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"))

    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        }
    }

    let prefix = prefixes[message.guild.id].prefixes
    if (!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)){
        message.delete()
        return message.reply(`You have to wait ${cdseconds} seconds between commands.`).then(m => m.delete(5000))
    }
    if(!message.member.hasPermission("ADMINISTRATOR")){
        cooldown.add(message.author.id)
    }

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = client.commands.get(cmd);
    // If none is found, try to find it by alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(client, message, args, ops);
    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cdseconds * 1000)
});

client.login(process.env.TOKEN);