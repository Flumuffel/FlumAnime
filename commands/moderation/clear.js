module.exports = {
    name: "clear",
    aliases: ["nuke", "purge"],
    category: "moderation",
    description: "Clear a amount of messages",
    usage: "<number>",
    run: async (client, message, args) => {
        if (message.deleteable) {
            message.delete()
        }
        //memer doesn't have permission
        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You can't delete messages...").then(m => m.delete(5000))
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Yeah... That's not a number? I also can't delete 0 messages by the way.").then(m => m.delete(5000))   
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Sorry... I can't delete messages.").then(m => m.delete(5000))
        }

        let deleteAmout

        if(parseInt(args[0] > 100)) {
            deleteAmout = 100
        } else {
            deleteAmout = parseInt(args[0])
        }

        message.channel.bulkDelete(deleteAmout, true)
        .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`))
        .catch(err => message.reply(`Something went wrong... ${err}`)).then(m => m.delete(5000))
    }
}