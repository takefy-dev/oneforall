module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('coins', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,

            },
            userId: {
                type: Sequelize.STRING(25),
                allowNull: false
            },
            coins : {
                type: Sequelize.FLOAT(255,2),
                allowNull: false,
                defaultValue: 0
            },
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}