module.exports = {
    name: "pause",
    category: "music",
    description: "Pause the music it's currently playing",
    usage: "",
    run: async (client, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id)

        if (!fetched) return message.channel.send('There currently isn\'t any music playing in this guild!')

        if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you aren\'t in the same channel as the music bot')

        if (fetched.dispatcher.paused) return message.channel.send('This music is alredy paused.')

        fetched.dispatcher.pause()

        message.channel.send(`Successfully paused ${fetched.queue[0].songTitle}`)

    }
}