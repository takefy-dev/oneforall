module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('antiraidConfig', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            webhookUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            roleCreate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            roleUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            roleDelete: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            channelCreate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            channelUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            channelDelete: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiSpam: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiBot: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiMassBan: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiMassBanLimit: {
                type : Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 3
            },
            roleAdd: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiDeco: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiDecoLimit: {
                type : Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            antiKick: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiKickLimit: {
                type : Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            antiDc: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            antiDcLimit: {
                type : Sequelize.STRING(4),
                allowNull: false,
                defaultValue: '1d'
            },
            regionUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            nameUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },
            vanityUpdate: {
                type : Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'unrank'
            },



        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}