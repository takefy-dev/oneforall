module.exports =  (database, DataTypes, modelName, config) => {
    try {
        database.define(modelName, {
            guildId: {
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            prefix: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: config.prefix
            },
            antiraid : {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {
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
                    }
                }
            },
            antiraidLimits : {
              type: DataTypes.JSON,
              allowNull: true,
              defaultValue: {
                  antiToken : {recentJoined: [], counter:0}
              }
            },
            muteRoleId: {
                type: DataTypes.STRING(25),
                allowNull: true,
            },
            color: {
                type: DataTypes.STRING(7),
                allowNull: false,
                defaultValue: "#36393F",
            },
            setup: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            whitelisted: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            memberRole: {
                type: DataTypes.STRING(25),
                allowNull: true
            },
            invite : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {
                    id: 'Non définie',
                    message: 'Non définie',
                    enable: false,
                }
            },
            soutien :{
                type : DataTypes.JSON,
                allowNull: true,
                defaultValue: {
                    roleId: 'Non définie',
                    message : 'Non définie',
                    enable: false
                }

            },
            owners: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: []
            },
            lang: {
                type: DataTypes.STRING(2),
                allowNull: false,
                defaultValue: "fr"
            },
            logs : {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {
                    mod : 'Non définie',
                    voice : 'Non définie',
                    message: 'Non définie',
                    antiraid: 'Non définie'
                }
            },
            counter: {
              type: DataTypes.JSON,
              allowNull: true,
              defaultValue: {
                  member : {name: 'Non définie'},
                  voice: {name : 'Non définie'},
                  online: {name : 'Non définie'},
                  offline: {name : 'Non définie'},
                  bot: {name : 'Non définie'},
                  channel: {name : 'Non définie'},
                  role: {name: 'Non définie'},
                  booster: {name: 'Non définie'},

              }
            },
            warns : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {
                    settings: {
                        ban : 4,
                        kick: 3,
                        mute : 2,
                    },
                }
            },
            tempvoc : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: [{category: 'Non définie', channel: 'Non définie', name: 'Non définie'}]
            },
            perms : {
                type : DataTypes.JSON,
                allowNull: true,
                defaultValue: {
                    role: {
                        perm1 : [],
                        perm2 : [],
                        perm3: [],
                        perm4: []
                    },
                    commands : {
                        perm1: ['clear', 'warn', 'unwarn', 'warnlist', 'warnsettings', 'mute', 'mutelist', 'tempmute', 'unmute', 'addemoji', 'rmemoji'],
                        perm2: ['ban', 'kick', 'lockchannel', 'unban', 'clear', 'alladmin', 'allbot', 'banlist'],
                        perm3: ['derank', 'nuke', 'say', 'soutien', 'gcreate', 'greroll', 'voicekick', 'glist', 'gend'],
                        perm4: ['cleanup', 'piconly', 'reaction', 'addinvite', 'clearinvite', 'removeinvite', 'compteur', 'embedBuilder', 'massiverole', 'reactionRoleMenu', 'role', 'tempvoc', 'setcolor', 'webhook',"bringall"]
                    },
                    enable: false
                }
            },
            reactroles : {
                type : DataTypes.JSON,
                allowNull: true,
                defaultValue: [
                    {
                        channel: null,
                        message: null,
                        emojiRole: []
                    }
                ]
            },
            piconly : {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: '[]'
            },
            coinsSettings : {
                type: DataTypes.JSON,
                defaultValue: {
                    enable: false,
                    streamBoost: 1.5,
                    muteDiviseur: 0.5,
                    logs: 'Non définie'
                }
            },
            coinsShop : {
                type: DataTypes.JSON,
                allowNull: true,
            },
            reactionsToMessages : {
                type: DataTypes.JSON,
                allowNull: true
            }


        }, {
            tableName: modelName,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
        database.models[modelName].sync({
            alter: true
        })
        return database.models[modelName]
    } catch (e) {
        console.log(e)
    }
}
