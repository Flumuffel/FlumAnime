const { RichEmbed } = require('discord.js')
const randomPuppy = require('random-puppy')

module.exports = {
    name: 'animeme',
    aliases: ['anime'],
    category: 'fun',
    description: 'Returns a epic meme',
    usage: '',
    run: async (client, message, args) => {
        const subReddits = ['DnDAnimemes', 'animememes', 'Animemes']
        const random = subReddits[Math.floor(Math.random() * subReddits.length)]

        const img = await randomPuppy(random)
        const embed = new RichEmbed()
            .setColor('RANDOM')
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`http://reddit.com/r/${random}`)

        message.channel.send(embed)


    }
}