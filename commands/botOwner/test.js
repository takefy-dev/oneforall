const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
const emojiEnable = {
    true: "<:778348494712340561:781153837850820619>",
    false: "<:778348494712340561:781153837850820619>"
}
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'test',
            description: 'test',
            category: 'test',

        });
    }
    async run(client, message,args){
        let lang = client.lang(message.guild.lang)
        const color = message.guild.color
        if(args[0] === "config"){
            const msg = await message.channel.send(lang.loading)
            const emojis = ['◀', '1️⃣', "2️⃣", '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣','9️⃣' ,'▶', '❌']
            for await(const em of emojis){
                await msg.react(em)
            }
            const antiraidConfig = message.guild.antiraid;
            let {enable, config, bypass} = antiraidConfig;
            let fields = []
            let i = 0;
            for(const [name, isEnable]  of Object.entries(enable)){
                        i++
                        if(i > 9) i = 1
                        fields.push({
                            name : `${i} ・ ${name}`,
                            value : `Actif: ${emojiEnable[isEnable]}`
                        })

            }
            i = 0

            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            for(let [name, sanction] of Object.entries(config)){
                if(name.toLowerCase().endsWith('limit')){
                    const eventName = name.toLowerCase().split('limit')[0]
                    const field = fields.filter(field => field.name.toLowerCase().includes(eventName))
                    field[0].value += `\nLimite: **${sanction}**`
                }else{
                    if(i < fields.length -1) {
                        if(fields[i].name === "antiSpam") sanction = "mute"
                        fields[i].value += `\nSanction: **${sanction}**`
                    }
                }
                i++


            }
            i=0
            for(const [, bp] of Object.entries(bypass)){
                if(i < fields.length -1){
                    fields[i].value += `\nWhitelist bypass : **${!bp ? 'Non' : 'Oui'}**\n`
                    i++
                }


            }
            let page = 0
            let embed = (page) => [
                {
                    fields: fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length),

                    color,
                    timestamp: new Date(),
                    footer: {
                        text: `Antiraid Config  ${page < 1 ? 1 : 2}/${parseInt(Object.entries(enable).length/9)}`,
                        icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                    },
                }
            ]
            msg.edit('', {embed: embed(page)[0]}).then(async m => {
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if(r.emoji.name === emojis[0]){
                        if(page < 1){
                            page = Object.entries(enable).length/9
                        }else{
                            page--
                        }


                        msg.edit('', {embed: embed(page)[0]})
                    }else if(r.emoji.name === emojis[emojis.length - 2]){
                        if(page >= Object.entries(enable).length/9){
                            page = 0
                        }else{
                            page++
                        }
                        msg.edit('', {embed: embed(page)[0]})
                    }
                })
            })
        }

    }
}