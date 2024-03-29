const moment = require('moment')
module.exports =  {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const guild = member.guild;
        const guildData = await client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const {id, message, enable} = guildData.get('invite');

        if (!id || !message || !enable) return;

        const channel = guild.channels.cache.get(id);
        const lang = guildData.lang;
        const {cachedInv} = guildData;
        const newInv = await guild.invites.fetch()
        const usedInv = await newInv.find(inv =>  cachedInv.get(inv.code) < inv.uses );
        for (const [code, invite] of newInv) {
            cachedInv.set(code, invite.uses)
        }
        let finalMsg;
        if (!usedInv) {
            finalMsg = lang.invite.cantTrace(member)

            if (guild.vanityURLCode) {
                finalMsg = lang.invite.vanity(member)
            }
            if (member.user.bot) {
                finalMsg = lang.invite.oauth(member)
            }
        } else {
            const fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3;
            let inviter = await guild.members.fetch(usedInv.inviter.id);
            if (inviter) {
                const userData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${usedInv.inviter.id}`)

                let count = userData.get('invite');
                count.join += 1;
                if (fake) count.fake += 1;
                userData.set('invite', count).save()
                const invitedData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`);
                invitedData.values.invite.invitedBy = inviter.id
                invitedData.save()
                let space = "\n"
                let join = `${count.join}`;
                let memberTotal = `${guild.memberCount}`

                finalMsg = message.replace(/{invitedMention}/g, member).replace(/{inviterTag}/g, inviter.user.tag || inviter.user.username).replace(/{count}/g, join).replace(/{memberTotal}/g, memberTotal).replace(/{invitedTag}/g, member.user.tag || member.user.username).replace(/{inviterMention}/g, inviter).replace(/{fake}/g, count.fake).replace(/{leave}/g, count.leave).replace(/{creation}/g, moment(member.user.createdAt).format("DD/MM/YYYY"));
                while (finalMsg.includes("{space}")) {
                    finalMsg.replace(/{space}/g, space)
                }
            }
        }
        if (channel && !channel.deleted) channel.send(finalMsg)





    }
}