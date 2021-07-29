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
                defaultValue: config.defaultAntiraidConfig
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
                defaultValue: config.defaultPermSetup
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
            },
            xp: {
                type: DataTypes.JSON,
                allowNull: true
            },
            level : {
                type: DataTypes.JSON,
                allowNull: true
            }

        }, {
            tableName: modelName,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
        database.models[modelName].sync()
        return database.models[modelName]
    } catch (e) {
        console.log(e)
    }
}
