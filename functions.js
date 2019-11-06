module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase()

        let target = message.guild.members.get(toFind)
        
        if (!target && message.mentions.member)
            target = message.mentions.member.first()

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) || 
                member.user.tag.toLowerCase().includes(toFind)
            })
        }

        if (!target)
            target = message.member

        return target
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('de-DE').format(date) 
    }
}