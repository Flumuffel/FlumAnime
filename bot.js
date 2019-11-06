const Discord = require('discord.js');
const RichEmbed = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNjM3NjA5MDEzODU3NDg2OSIsImJvdCI6dHJ1ZSwiaWF0IjoxNTY5NTk1MzU0fQ.b9DhDAQ7ACgVzNU4QTBU-PHbZGMf-1iTfLk18yVBTNA', client);

const prefix = '-';
const ownerID = '274209471968837634';
const active = new Map();

const db = require('quick.db');

client.on('message', async message => {
  
  if (message.author.bot) return;
  
  if (message.channel.type !== 'text') {
   
    let active = await db.fetch(`support_${message.author.id}`);
    
    let guild = client.guilds.get('632290729678602240');
    
    let channel, found = true;
    
    try {
      if (active) client.channels.get(active.channelID).guild;
    } catch (e) {
      found = false;
    }
    
    if (!active || !found) {
      
      active = {};
      
      channel = await guild.createChannel(`${message.author.username}-${message.author.discriminator}`, {
        type: 'text',
        parent: '632291021769801740',
        topic: `!complete to close the ticket | Support for ${message.author.tag} | ID: ${message.author.id}`
      });
      
      
      const newChannel = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setAuthor(message.author.tag, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")
        .setFooter('Support Ticket Created')
        .addField('User', message.author)
        .addField('ID', message.author.id)
      
      await channel.send(newChannel);
      
      const newTicket = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setAuthor(`Hello, ${message.author.tag}`, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")
        .setFooter('Support Ticket Created')
      
      await message.author.send(newTicket);
      
      active.channelID = channel.id;
      active.targetID = message.author.id;
      
    }
    
    channel = client.channels.get(active.channelID);
    
    const dm = new Discord.RichEmbed()
      .setColor(0x36393e)
      .setAuthor(`Thank you, ${message.author.tag}`, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")
      .setFooter(`Your message has been sent -- A staff member will be in contact soon`)
    
    await message.author.send(dm)
    
     const embed = new Discord.RichEmbed()
      .setColor(0x36393e)
      .setAuthor(message.author.tag, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")
      .setDescription(message.content)
      .setFooter(`Message Recived -- ${message.author.tag}`)
     
     await channel.send(embed);
    
    db.set(`support_${message.author.id}`, active);
    db.set(`supportChannel_${channel.id}`, message.author.id);
    return;
    
  }
  
  let support = await db.fetch(`supportChannel_${message.channel.id}`);
  
  if (support) {
    
     support = await db.fetch(`support_${support}`);
    
    let supportUser = client.users.get(support.targetID);
    if (!supportUser) return message.channel.delete();
    
    if (message.content.toLowerCase() === '!complete') {
      
      const complete = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setAuthor(`Hey, ${supportUser.tag}`, "https://cdn.discordapp.com/avatars/"+supportUser.id+"/"+supportUser.avatar+".png")
        .setFooter('Ticket Closed -- Muffel Development')
        .setDescription('*Your ticket has been marked as **complete**. If you wish to reopen this, or create a new one, please send a message to the bot.*')
      
      supportUser.send(complete);
      
      message.channel.delete();
      
      return db.delete(`support_${support.targetID}`)
      
    } else if (message.content.toLowerCase() === '!blacklist') {
      message.channel.send(`You did blacklisted ${supportUser.tag}`)
      supportUser.block()
    } else if (message.content.toLowerCase() === '!unblacklist') {
      message.channel.send(`You did unblacklisted ${supportUser.tag}`)
      supportUser.unblock()
    }
    
    const embed = new Discord.RichEmbed()
      .setColor(0x36393e)
      .setAuthor(message.author.tag, "https://cdn.discordapp.com/avatars/"+message.author.id+"/"+message.author.avatar+".png")
      .setFooter(`Message Recived -- Muffel Development`)
      .setDescription(message.content)
    
    client.users.get(support.targetID).send(embed)
    
    message.delete({timeout: 1000});
    
    embed.setFooter(`Message Sent -- ${supportUser.tag}`).setDescription(message.content);
    
    return message.channel.send(embed);
    
  }
  
  let args = message.content.slice(prefix.length).trim().split(' ');
  let cmd = args.shift().toLowerCase();
  
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (config.beta !== false && message.author.id !== ownerID) return message.author.send('The bot is right now in Beta so only the BotOwner can use him!')
  
  try {
    
    delete require.cache[require.resolve(`./commands/${cmd}.js`)];
    
    let ops = {
      ownerID: ownerID,
      active: active
    }
    
    let commandFile = require(`./commands/${cmd}.js`)
    commandFile.run(client, message, args, ops)
    
  } catch (e) {
    console.log(e.stack);
  }
  
});

client.on('ready', () => {
  console.log('Launched!');
    const status = ["FlumAnime | V2","For support DM the bot","Use -help to see commands","FlumAnime | Beta", "GRAND UPDATE REALLY SOON"];
    let i = 0;
setInterval(()=>{
  client.user.setActivity(status[i++],{type:"playing"});
  if(i==status.length)i=0;   
},12000)
setInterval(() => {
        dbl.postStats(client.guilds.size);
}, 180000);
  
});

client.login(config.token);

const express = require('express');
const keepalive = require('express-glitch-keepalive');

const app = express();

app.use(keepalive);

app.get('/', (req, res) => {
res.json('This bot should be online! Uptimerobot will keep it alive');
});
app.get("/", (request, response) => {
response.sendStatus(200);
});
app.listen(process.env.PORT);

