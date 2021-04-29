
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const NumberFromEmoji = require('../../utils/emojiToNumber')
const emojiEnable = {
    true: "<:778348494712340561:781153837850820619>",
    false: "<:778348495157329930:781189773645578311>"
}
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'antiraid',
            description: "Setup the antiraid | Configurer l'antiraid",
            usage: '!antiraid',
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
            category: 'owners',
            guildOwnerOnly: true,
            onlyTopGg: true
        });
    }

    async run(client, message, args) {
        let lang = client.lang(message.guild.lang);

        const color = message.guild.color
        if(args[0] === "on"){
            const { enable } = message.guild.antiraid;
            for(const [name,_] of Object.entries(enable)){
                enable[name] = true;
            }
            await message.guild.updateAntiraid(message.guild.antiraid)

        }
        if(args[0] === "off"){
            const { enable } = message.guild.antiraid;
            for(const [name,_] of Object.entries(enable)){
                enable[name] = false;
            }
            await message.guild.updateAntiraid(message.guild.antiraid)
        }
        if(args[0] === "opti"){
            const { enable, config, bypass } = message.guild.antiraid
            for(const [name,_] of Object.entries(enable)){
                enable[name] = true;
            }
            config["webhookUpdate"] = "ban"
            bypass["webhookUpdate"] = false

        }
        if (args[0] === "config") {
            const msg = await message.channel.send(lang.loading)
            const emojis = ['◀', '1️⃣', "2️⃣", '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '▶', '❌']
            for await(const em of emojis) {
                await msg.react(em)
            }


            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;


            let fields = []

            let antiraidConfig = {...message.guild.antiraid};
            let {enable, config, bypass} = antiraidConfig;
            let arrayEnable = Object.entries(enable)
            let page = 0
            const initFields = (renew) => {
                if (renew) fields = [];
                let i = 0;
                for (const [name, isEnable] of Object.entries(enable)) {
                    i++
                    if (i > 9) i = 1
                    fields.push({
                        name: `${i} ・ ${name}`,
                        value: `Actif: ${emojiEnable[isEnable]}`
                    })

                }
                i = 0
                for (let [name, sanction] of Object.entries(config)) {
                    if (name.toLowerCase().endsWith('limit')) {
                        const eventName = name.toLowerCase().split('limit')[0]
                        const field = fields.filter(field => field.name.toLowerCase().includes(eventName))
                        field[0].value += `\nLimite: **${sanction}**`
                    } else {
                        if (i < fields.length - 1) {
                            if (name === "antiSpam") sanction = "mute"
                            fields[i].value += `\nSanction: **${sanction}**`
                        }
                    }
                    i++


                }
                i = 0
                for (const [, bp] of Object.entries(bypass)) {
                    if (i < fields.length - 1) {
                        fields[i].value += `\nWhitelist bypass : **${!bp ? 'Non' : 'Oui'}**\n`
                        i++
                    }
                }
            }
            let embed = (page) => {
                initFields(true)
                return [{

                    fields: fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length),

                    color,
                    timestamp: new Date(),
                    footer: {
                        text: `Antiraid Config  ${page < 1 ? 1 : 2}/${parseInt(arrayEnable.length / 9)}`,
                        icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                    },
                },

                ]
            }
            let editMenu = async (index, subMenu) => {

                await subMenu.reactions.removeAll()
                let pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                const name = pageSection[index].name.split('・')[1]
                let splitedValue = pageSection[index].value.split('\n').filter(x => x !== "")

                const putEmoji = () => {
                    splitedValue = pageSection[index].value.split('\n').filter(x => x !== "")
                    splitedValue[0] = `\`🟢\` ${splitedValue[0]}`
                    splitedValue[1] =  `\`🔵\` ${splitedValue[1]}`
                    splitedValue[2] = `\`🟣\` ${splitedValue[2]}`
                    if(splitedValue.length > 3)  splitedValue[3] = `\`🟤\` ${splitedValue[3]}`

                    return pageSection[index].value = splitedValue.join('\n')
                }
                putEmoji()



                await subMenu.edit('', {
                    embed: {
                        title: name,
                        description: pageSection[index].value,
                        color,
                        timestamp: new Date(),
                        footer: {
                            text: name,
                            icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                        },
                    }

                })
                const indispensableEmoji = ['↩', '❌']
                const eventName = name.split(' ')[1]

                await subMenu.react(indispensableEmoji[0])
                addEmoji: for (let i = 1; i <= splitedValue.length; i++) {
                    if (eventName === "antiSpam" && i === 2) continue addEmoji
                    const em = NumberFromEmoji.toEmoji(i)
                    await subMenu.react(em)
                    indispensableEmoji.push(em)
                }

                let emojiQuestion = {
                    "🔵": {question: lang.antiraidConfig.sanctionQ, type: 'sanction'},

                }
                if (splitedValue.length >= 4) {
                    emojiQuestion[indispensableEmoji[4]] = {question: lang.antiraidConfig.limitQ, type: 'limit'}
                }
                await subMenu.react(indispensableEmoji[1])
                let emojiFilter = (reaction, user) => indispensableEmoji.includes(reaction.emoji.name) && user.id === message.author.id,
                    dureefiltrer = response => {
                        return response.author.id === message.author.id
                    };
                const collector = subMenu.createReactionCollector(emojiFilter, {time: 900000});
                collector.on('collect', async r => {

                    await r.users.remove(message.author);

                    if (r.emoji.name === indispensableEmoji[0]) {

                        subMenu.edit('', {embed: embed(page)[0]})
                        await subMenu.reactions.removeAll()
                        for (const em of emojis) {
                            await subMenu.react(em)
                        }
                        return collector.stop()
                    } else if (r.emoji.name === indispensableEmoji[1]) {
                        collector.stop()
                        subMenu.delete();
                    } else if (r.emoji.name === indispensableEmoji[2]) {
                        const isEnable = enable[name.split(' ')[1]]
                        enable[eventName] = isEnable === false


                    } else if (r.emoji.name === indispensableEmoji[indispensableEmoji.length - 1]) {
                        const bypassEnable = bypass[name.split(' ')[1]]
                        bypass[eventName] = bypassEnable === false

                    }
                    if (Object.keys(emojiQuestion).includes(r.emoji.name)) {
                        const {question, type} = emojiQuestion[r.emoji.name];
                        await message.channel.send(question).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (type === 'limit') {
                                        if (eventName === "antiDc") {
                                            if (isNaN(msg.content.split('')[0]) || !msg.content.endsWith('s') || !msg.content.endsWith('m') || !msg.content.endsWith('h') || !msg.content.endsWith('d') || !msg.content.endsWith('w') || !msg.content.endsWith('y')) {
                                                return message.channel.send(lang.antiraidConfig.antiDcError)
                                            }
                                        } else {
                                            if (isNaN(!msg.content)) {
                                                return message.channel.send(lang.antiraidConfig.limitError)
                                            }
                                        }
                                        config[`${eventName}Limit`] = msg.content;

                                    } else {
                                        if (eventName === 'antiDc' && msg.content === 'unrank') {
                                            return message.channel.send(lang.antiraidConfig.antiDcUnrank)
                                        }
                                        config[eventName] = msg.content;

                                    }

                                    mp.delete()
                                    msg.delete()
                                    initFields(true)
                                    pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                                    putEmoji()
                                    return subMenu.edit('', {
                                        embed: {
                                            title: name,
                                            description: pageSection[index].value,
                                            color,
                                            timestamp: new Date(),
                                            footer: {
                                                text: name,
                                                icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                                            },
                                        }

                                    })
                                });
                        })

                    }
                    initFields(true)
                    pageSection = fields.slice(page === 0 ? 0 : 9, page === 0 ? 9 : fields.length)
                    putEmoji()

                    return await subMenu.edit('', {
                        embed: {
                            title: name,
                            description: pageSection[index].value,
                            color,
                            timestamp: new Date(),
                            footer: {
                                text: name,
                                icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                            },
                        }

                    })


                })


            }
            const saveFilter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            const confirMsg = await message.channel.send(lang.antiraidConfig.reactsave)
            await confirMsg.react('✅')
            const saveCollector = confirMsg.createReactionCollector(saveFilter, {time: 900000});
            saveCollector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === '✅') {
                    await message.guild.updateAntiraid(antiraidConfig)
                    const replyMsg = message.channel.send(lang.antiraidConfig.savedmsg);
                    setTimeout(async () => {
                        await saveCollector.stop();

                    }, 5000)
                }
            });

            msg.edit('', {embed: embed(page)[0]}).then(async m => {
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojis[0]) {
                        if (page < 1) {
                            page = 1
                        } else {
                            page--
                        }


                        return msg.edit('', {embed: embed(page)[0]})
                    } else if (r.emoji.name === emojis[emojis.length - 2]) {
                        if (page >= arrayEnable.length / 9) {
                            page = 0
                        } else {
                            page++
                        }


                        return msg.edit('', {embed: embed(page)[0]})
                    } else if (r.emoji.name === emojis[emojis.length - 1]) {

                        msg.delete()
                        saveCollector.stop()
                        confirMsg.delete()
                        return collector.stop();
                    }
                    const number = NumberFromEmoji.fromEmoji(r.emoji.name)
                    await editMenu(number - 1, msg)

                })


            })
            saveCollector.on('end', async (_, reason) => {
                console.log("stop")
                await confirMsg.delete();
                await msg.reactions.removeAll()
                await msg.delete()
                if(reason === "time"){
                    const timeoutmsg = await message.channel.send(lang.antiraidConfig.timeoutmsg);
                    setTimeout(async () => {
                        timeoutmsg.delete()
                    }, 5000)
                }

            });
        }
    }
}
