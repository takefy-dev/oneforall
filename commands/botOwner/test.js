module.exports = {

    name: 'test',
    description: 'test',
    category: 'test',


    run: async (client, message, args) => {
        const m = await message.guild.members.fetch('116275390695079945')
        console.log(m.roles.botRole.setPermissions([]))

    }
}