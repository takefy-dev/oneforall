module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('antiraidWlBp', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            webhookUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            roleCreate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            roleUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            roleDelete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            channelCreate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            channelUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            channelDelete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiSpam: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiMassBan: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiBot: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            roleAdd: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiLink: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiDeco: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            antiKick: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            regionUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            nameUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            vanityUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}