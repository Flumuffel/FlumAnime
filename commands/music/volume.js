module.exports = {
    name: "volume",
    aliases: ["vol"],
    category: "music",
    description: "Leave the channel",
    usage: "<number>",
    run: async (client, message, args, ops) => {

        let fetched = ops.active.get(message.guild.id)

        if (!fetched) return message.channel.send("There currently isn't any music playing in this guild!")

        if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('Sorry, you currently aren\'t in the same channel as the music bot')

        if (isNaN(args[0]) || args[0] > 100 || args[0] < 20) return message.channel.send('Pleaase input a number between 20-100')

        fetched.dispatcher.setVolume(args[0]/100)

        message.channel.send(`Successfully set volume of ${fetched.queue[0].songTitle} to ${args[0]}`)

    }
}