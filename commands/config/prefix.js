const { RichEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
    name: "prefix",
    aliases: ["p"],
    category: "config",
    description: "Get a custom prefix for your server",
    usage: "<prefix>",
    run: async (client, message, args) => {

        if (!message.member.hasPermission("MANAGE_SERVER")) return message.reply("No no no.")
        if(!args[0]) return message.reply("Please provide a prefix!").then(m => m.delete(5000))

        let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"))

        prefixes[message.guild.id] = {
            prefixes: args[0]
        }

        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
            if (err) console.log(err)
        })

        let sEmbed = new RichEmbed()
            .setColor("#FF9900")
            .setTitle('Prefix Set!')
            .setDescription(`Set to${args[0]}`)

        message.channel.send(sEmbed)

    }
}