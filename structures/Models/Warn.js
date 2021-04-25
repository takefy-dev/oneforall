module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('warn', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: Sequelize.STRING(25),
                allowNull: false,
            },
            guildId:{
                type: Sequelize.STRING(25),
                allowNull: false
            },
            warn: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}