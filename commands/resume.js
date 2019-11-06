exports.name = "resume";
exports.description = "To resume the paused music!";
exports.run = (client, message, args, ops) => {
  
  let fetched = ops.active.get(message.guild.id);
  
  if (!fetched) return message.channel.send('There currently isn\'t any music playing on this guild!');
  
  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you aren\'t in the same channel as the bot.');
  
  if (!fetched.dispatcher.paused) return message.channel.send('The music isn\'t paused.');
  
  fetched.dispatcher.resume();
  
  message.channel.send(`Successfully resumed ${fetched.queue[0].songTitle}`);
  
}