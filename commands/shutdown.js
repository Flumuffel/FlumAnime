exports.name = "shutdown";
exports.description = "To shutdown the bot!";
exports.run = async (client, message, args, ops) => {
  
   if (message.author.id !== ops.ownerID) return message.channel.send('Sorry, only the owner can use this command.');
  
  try {
    await message.channel.send("Bot is shuting down...");
    process.exit();
  } catch(e) {
    message.channel.send(`ERROR: ${e.message}`);
  }
  
}