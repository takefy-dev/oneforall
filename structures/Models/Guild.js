module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('guildConfig', {
            guildId: {
              type: Sequelize.STRING(25),
              allowNull: false,
              primaryKey: true
            },
            prefix:{
                type: Sequelize.STRING(1),
                allowNull: false,
                defaultValue: oneforall.config.prefix
            },
            muteRoleId : {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            embedColors : {
                type: Sequelize.STRING(7),
                allowNull: false,
                defaultValue: "#36393F",
            },
            setup : {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            whitelisted : {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            },
            memberRole : {
                type: Sequelize.STRING(25),
                allowNull: true
            },
            inviteMessage : {
                type: Sequelize.TEXT,
                allowNull: true
            },
            inviteChannel :{
                type: Sequelize.STRING(25),
                allowNull: true
            },
            soutienId: {
                type: Sequelize.STRING(25),
                allowNull: true
            },
            soutienMsg :{
                type: Sequelize.TEXT,
                allowNull: true
            },
            soutienOn : {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            inviteOn : {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            owner : {
                type: Sequelize.TEXT,
                allowNull: true,
                defaultValue: ''
            },
            lang : {
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
            memberCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            voiceCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            onlineCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            offlineCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            botCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            channelCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            roleCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            boosterCount : {
                type: Sequelize.JSON(),
                allowNull: true
            },
            statsOn : {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },
            warnBan : {
                type : Sequelize.INTEGER,
                defaultValue: 4,
                allowNull: false,
            },
            warnKick : {
                type : Sequelize.INTEGER,
                defaultValue: 3,
                allowNull: false,
            },
            warnMute : {
                type : Sequelize.INTEGER,
                defaultValue: 2,
                allowNull: false,
            },
            coinsOn : {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: true
            },







        }, {
            tableName: 'guildConfig'
        })
        return oneforall.database.models
    }catch (e) {
        console.log(e)
    }
}