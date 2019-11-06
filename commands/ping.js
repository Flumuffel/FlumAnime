exports.name = "ping";
exports.description = "To ping the bot!";
exports.run = (client, message, args) => {
  
  message.channel.send("Pinging...").then(m => {
    
    let ping = m.createdTimestamp - message.createdTimestamp;
    let choices = ["Is this really my ping", "Is it okay? I cant look", "I hope it isn't bad"];
    let response = choices[Math.floor(Math.random() * choices.length)];
    
    m.edit(`${response}: Bot Latency: \`${ping}\`, API Latency: \`${Math.round(client.ping)}\``);
    
  })
  
}