module.exports = {
    token: "ODY0NTI2MzkwMTc0OTQxMTg0.YO2u8Q.amqodi7uoJNy7tOTEZq1iqE0whY",
    prefix: '!',
    database : {
        user: 'takefydev',
        name: 'oneforall_test',
        password : 'murphy7777'
    },
    color: '#36393F',
    owners: ['708047733994553344', '659038301331783680', '295947937756872709'],
    botperso: false,
    dev : true,
    defaultAntiraidConfig: {
        enable: {

            webhookUpdate: false,
            roleCreate: false,
            roleUpdate: false,
            roleDelete: false,
            channelCreate: false,
            channelUpdate: false,
            channelDelete: false,
            antiSpam: false,
            antiMassBan: false,
            antiBot: false,
            roleAdd: false,
            antiLink: false,
            antiDeco: false,
            antiKick: false,
            antiDc: false,
            regionUpdate: false,
            nameUpdate: false,
            vanityUpdate: false,
            antiToken : false,
            antiMassMention: false,
        },
        config: {
            webhookUpdate: 'unrank',
            roleCreate: 'unrank',
            roleUpdate: 'unrank',
            roleDelete: 'unrank',
            channelCreate: 'unrank',
            channelUpdate: 'unrank',
            channelDelete: 'unrank',
            antiSpam: 'unrank',
            antiMassBan: 'unrank',
            antiMassBanLimit: 3,
            antiBot: 'unrank',
            roleAdd: 'unrank',
            antiLink: 'unrank',
            antiDeco: 'unrank',
            antiDecoLimit: 5,
            antiKick: 'unrank',
            antiKickLimit: 5,
            antiDc: 'kick',
            antiDcLimit: '1d',
            regionUpdate: 'unrank',
            nameUpdate: 'unrank',
            vanityUpdate: 'unrank',
            antiToken : 'kick',
            antiTokenLimit: '10/10s',
            antiMassMention: 'kick',
            antiMassMentionLimit: '10/10s'
        },
        bypass: {
            webhookUpdate: false,
            roleCreate: false,
            roleUpdate: false,
            roleDelete: false,
            channelCreate: false,
            channelUpdate: false,
            channelDelete: false,
            antiSpam: false,
            antiMassBan: false,
            antiBot: false,
            roleAdd: false,
            antiLink: false,
            antiDeco: false,
            antiKick: false,
            antiDc: false,
            regionUpdate: false,
            nameUpdate: false,
            vanityUpdate: false,
            antiToken: false,
            antiMassMention: false,
        }
    },
    defaultPermSetup: {
        role: {
            perm1: [],
            perm2: [],
            perm3: [],
            perm4: []
        },
        commands: {
            perm1: ['clear', 'warn', 'unwarn', 'warnlist', 'warnsettings', 'mute', 'mutelist', 'tempmute', 'unmute', 'addemoji', 'rmemoji'],
            perm2: ['ban', 'kick', 'lockchannel', 'unban', 'clear', 'alladmin', 'allbot', 'banlist'],
            perm3: ['derank', 'nuke', 'say', 'soutien', 'gcreate', 'greroll', 'voicekick', 'glist', 'gend'],
            perm4: ['cleanup', 'piconly', 'reaction', 'addinvite', 'clearinvite', 'removeinvite', 'compteur', 'embedBuilder', 'massiverole', 'reactionRoleMenu', 'role', 'tempvoc', 'setcolor', 'webhook',"bringall"]
        },
        enable: false
    },
    topGgToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4MDAxOTM0NDUxMTMzNjUxOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI3ODkzODYxfQ.0q6wjgXZLk7TIbLrtBvWJ9w5S8ekQLGeTzOK7GMF0W8"
}
