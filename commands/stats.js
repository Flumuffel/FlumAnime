const Discord = require('discord.js');

exports.name = "stats";
exports.description = "To show the stats!";
exports.run = (client, message, args, ops) => {
  
   const stats = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setTitle('Bot stats -- FlumAnime')
        .addField("Server count:", client.guilds.size)  
   
      message.channel.send(stats);
  
}