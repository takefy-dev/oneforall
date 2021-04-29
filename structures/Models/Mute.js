module.exports = (Sequelize, oneforall) => {
    try {
        oneforall.database.define('mute', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            userId: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            expireAt :{
                type: Sequelize.DATE,
                allowNull: true
            }

        })
        return oneforall.database.models

    } catch (e) {
        console.log(e)
    }
}