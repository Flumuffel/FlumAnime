const ytdl = require('ytdl-core');
const streamOptions = {
  filter: 'audioonly',
  seek: 0,
  volume: 0.3
}

exports.name = "play";
exports.description = "To play the music of your choice!";
exports.run = async (client, message, args, ops) => {
  if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.');
  
  if (!args[0]) return message.channel.send('Sorry, please input a url following the command.');
  
  let validate = await ytdl.validateURL(args[0]);
  
  if (!validate) {
    
    let commandFile = require(`./search.js`);
    return commandFile.run(client, message, args, ops);
    
  }
  
  let info = await ytdl.getInfo(args[0]);
  
  let data = ops.active.get(message.guild.id) || {};
  
  if (!data.connection) data.connection = await message.member.voiceChannel.join();
  if (!data.queue) data.queue = [];
  data.guildID = message.guild.id;
  
  if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send('Sorry, you aren\'t connectet to the same channel.');
  
  data.queue.push({
    songTitle: info.title,
    requester: message.author.tag,
    url: args[0],
    announceChannel: message.channel.id
  });
  
  if (!data.dispatcher) play(client, ops, data);
  else {
    
    message.channel.send(`Added To Queue: ${info.title} | Requestet By: ${message.author.tag}`);
    
  }
  
  ops.active.set(message.guild.id, data);
  
}
async function play(client, ops, data) {
  
  client.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested By: ${data.queue[0].requester}`);
  
  data.dispatcher = data.connection.playStream(ytdl(data.queue[0].url, streamOptions));
  data.dispatcher.guildID = data.guildID;
  
  data.dispatcher.once('end', function() {
    finish(client, ops, this);
  }); 
  
}

function finish(client, ops, dispatcher) {
  
  let fetched = ops.active.get(dispatcher.guildID);
  
  fetched.queue.shift();
  
  if (fetched.queue.length > 0) {
  
    ops.active.set(dispatcher.guildID, fetched);
    
    play(client, ops, fetched);
    
  } else {
    
    ops.active.delete(dispatcher.guildID);
    
    let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
    if (vc) vc.leave();
    
  }
  
}