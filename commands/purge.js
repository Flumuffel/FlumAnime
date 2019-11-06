exports.name = "purge";
exports.description = "To delete a amount of messages!";
exports.run = (client, message, args, ops) => {
  
  if(isNaN(args[0])) return message.channel.send('**Please supply a vaild amount of messages to purge**');
  
  if (args[0] > 100) return message.channel.send('**Please supply a numer less that 100**');
  
  message.channel.bulkDelete(args[0])
    .then( messages => message.channel.send(`**Successfully delted \`${message.size}/${args[0]}\` messages**`).then( msg => msg.delete({ timeout: 10000})))
    .catch( error => message.channel.send(`**ERROR:** ${error.message}`));
  
}