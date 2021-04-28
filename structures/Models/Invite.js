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
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {
                    join: 0,
                    leave: 0,
                    fake: 0,
                    bonus: 0
                }
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