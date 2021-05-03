module.exports = (Sequelize, oneforall) => {
    try {
        oneforall.database.define('guildConfig', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            prefix: {
                type: Sequelize.STRING(1),
                allowNull: false,
                defaultValue: oneforall.config.prefix
            },
            muteRoleId: {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            embedColors: {
                type: Sequelize.STRING(7),
                allowNull: false,
                defaultValue: "#36393F",
            },
            setup: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            whitelisted: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            },
            memberRole: {
                type: Sequelize.STRING(25),
                allowNull: true
            },
            inviteMessage: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            inviteChannel: {
                type: Sequelize.STRING(25),
                allowNull: true
            },
            soutienId: {
                type: Sequelize.STRING(25),
                allowNull: true
            },
            soutienMsg: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            soutienOn: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            inviteOn: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            owner: {
                type: Sequelize.TEXT,
                allowNull: true,
                defaultValue: ''
            },
            lang: {
                type: Sequelize.STRING(2),
                allowNull: false,
                defaultValue: "fr"
            },
            modLog: {
                type: Sequelize.STRING(25),
                allowNull: true,
                defaultValue: 'Non définie'

            },
            voiceLog: {
                type: Sequelize.STRING(25),
                allowNull: true,
                defaultValue: 'Non définie'

            },
            msgLog: {
                type: Sequelize.STRING(25),
                allowNull: true,
                defaultValue: 'Non définie'

            },
            antiraidLog: {
                type: Sequelize.STRING(25),
                allowNull: true,
                defaultValue: 'Non définie'
            },
            memberCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue("memberCount"));
                },
                set: function (value) {
                    return this.setDataValue("memberCount", JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            },
            voiceCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('voiceCount'));
                },
                set: function (value) {
                   return this.setDataValue('voiceCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            
            },
            onlineCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('onlineCount'));
                },
                set: function (value) {
                   return this.setDataValue('onlineCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            
            },
            offlineCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('offlineCount'));
                },
                set: function (value) {
                   return this.setDataValue('offlineCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            
            },
            botCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('botCount'));
                },
                set: function (value) {
                   return this.setDataValue('botCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
           
            },
            channelCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('channelCount'));
                },
                set: function (value) {
                   return this.setDataValue('channelCount', JSON.stringify(value));
                },
           
                defaultValue: JSON.stringify({name: "Non définie"})
            },
            roleCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('roleCount'));
                },
                set: function (value) {
                   return this.setDataValue('roleCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            },
            boosterCount: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('boosterCount'));
                },
                set: function (value) {
                   return this.setDataValue('boosterCount', JSON.stringify(value));
                },
                defaultValue: JSON.stringify({name: "Non définie"})
            },
            statsOn: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },
            warnBan: {
                type: Sequelize.INTEGER,
                defaultValue: 4,
                allowNull: false,
            },
            warnKick: {
                type: Sequelize.INTEGER,
                defaultValue: 3,
                allowNull: false,
            },
            warnMute: {
                type: Sequelize.INTEGER,
                defaultValue: 2,
                allowNull: false,
            },
            coinsOn: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },
            coinsLogs: {
                type: Sequelize.STRING(25),
                allowNull: false,
                defaultValue: 'Non définie'
            },
            muteDiviseur: {
                type: Sequelize.FLOAT(),
                allowNull: false,
                defaultValue: 0.5
            },
            streamBoost: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 1.5
            }







        }, {
            tableName: 'guildConfig'
        })
        return oneforall.database.models
    } catch (e) {
        console.log(e)
    }
}