exports.name = "join";
exports.description = "To let the bot join in the channel!";
exports.run = (client, message, args) => {
  
  message.member.voiceChannel.join();
  
}