const fs = require('fs')
const Discord = require('discord.js');

exports.name = "help";
exports.description = "To see all commands that are anvailabe!";
exports.run = (client, message, args) => {
   
const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));
  
const embed = new Discord.RichEmbed()
      .setColor(0x36393e)
      .setAuthor(message.author.tag, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")

for (const file of commandFiles) {
    const filePath = `./${file}`;
    const command = require(filePath);
    //client.commands.set(command.name, command);
    embed.addField(command.name,command.description);
}
  message.channel.send(embed);
}