

module.exports = {

    name: 'test',
    description: 'test',
    category: 'test',


    run: async (client, message, args) => {
        const msg = await message.channel.messages.fetch(args[0])
        msg.embeds.forEach(embed => {
            message.guild.channels.cache.get('870295550396887050').send(`\`\`\`${JSON.stringify(embed, null, 2)}\`\`\``, {
                code: "js"
            })
        })


    }
}