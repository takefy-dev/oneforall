module.exports = (Sequelize, oneforall) => {
    try {
        oneforall.database.define('reactrole', {
            msgId: {
                type: Sequelize.STRING(25),
                primaryKey: true,
                allowNull: false
            },
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            emojiRole : {
                type: Sequelize.JSON,
                allowNull: false
            }

        })
        return oneforall.database.models

    } catch (e) {
        console.log(e)
    }
}