module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('giveaways', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            message_id: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            data: {
                type: Sequelize.JSON(),
                allowNull: false
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}