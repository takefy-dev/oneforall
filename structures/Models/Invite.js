module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('invite', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            guildId: {
                type: Sequelize.STRING(25),
                allowNull:false
            },
            count : {
                type: Sequelize.TEXT,
                allowNull: false,
                get: function () {
                    return JSON.parse(this.getDataValue('count'));
                },
                set: function (value) {
                    return this.setDataValue('count', JSON.stringify(value));
                },
                
                defaultValue: JSON.stringify({
                    join: 0,
                    leave: 0,
                    fake: 0,
                    bonus: 0
                })
            },
            invitedBy : {
                type: Sequelize.STRING(25),
                allowNull: true,
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}