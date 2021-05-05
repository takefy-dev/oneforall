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
                type: Sequelize.TEXT('long'),
                allowNull: false,
                get: function () {
                    return JSON.parse(this.getDataValue('emojiRole'));
                },
                set: function (value) {
                    return this.setDataValue('emojiRole', JSON.stringify(value));
                },
            }

        }, {
            tableName: 'reactRole'
        })
        return oneforall.database.models

    } catch (e) {
        console.log(e)
    }
}