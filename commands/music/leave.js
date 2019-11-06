module.exports = {
    name: "leave",
    aliases: ["disconnect","stop"],
    category: "music",
    description: "Leave the channel",
    usage: "",
    run: async (client, message, args, ops) => {

        if (!message.member.voiceChannel) return message.channel.send('Please connect to a vocie channel.')

        if (!message.guild.me.voiceChannel) return message.channel.send('Sorry, the bot isn\'t connected to the guild.')

        if (message.guild.me.voiceChannel !== message.member.voiceChannel) return message.channel.send('Sorry, you aren\'t connected to the same channel.')

        message.guild.me.voiceChannel.leave()

        message.channel.send('Leaving Channel...')

    }
}