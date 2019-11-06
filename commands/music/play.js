const ytdl = require('ytdl-core')

module.exports = {
    name: "play",
    aliases: ["song", "sing"],
    category: "music",
    description: "Play music in the vocie channel",
    usage: "<url>",
    run: async (client, message, args, ops) => {

        if (!message.member.voiceChannel) return message.channel.send('Please connect to a voice channel.')

        if (!args[0]) return message.channel.send('Sorry, please input a url following the command.')

        let validate = await ytdl.validateURL(args[0])

        if (!validate) return message.channel.send('Sorry, please input a **valid** url following the command.')

        let info = await ytdl.getInfo(args[0])

        let data = ops.active.get(message.guild.id) || {}

        if (!data.connection) data.connection = await message.member.voiceChannel.join()
        
        if (!data.queue) data.queue = []
        data.guildID = message.guild.id

        data.queue.push({
            songTitle: info.title,
            requester: message.author.tag,
            url: args[0],
            announceChannel: message.channel.id
        })

        if (!data.dispatcher) play(client, ops, data)
        else {
            message.channel.send(`Added To Queue: ${info.title} | Requested By: ${message.author.tag}`)
        }

        ops.active.set(message.guild.id, data)

    }
}

async function play(client, ops, data) {

    client.channels.get(data.queue[0].announceChannel).send(`Now Playing: ${data.queue[0].songTitle} | Requested By: ${data.queue[0].requester}`)

    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly', volume: '' }))
    data.dispatcher.setVolume(50/100)
    data.dispatcher.guildID = data.guildID

    data.dispatcher.once('end', function() {
        finish(client, ops, data.guildID)
    })

}

function finish(client, ops, guildID) {
    let fetched = ops.active.get(guildID)

    fetched.queue.shift()
    
    if (fetched.queue.length > 0) {

        ops.active.set(guildID, fetched)

        play(client, ops, fetched)

    } else {

        let vc = client.guilds.get(guildID).me.voiceChannel
        if (vc) vc.leave()

    }

}