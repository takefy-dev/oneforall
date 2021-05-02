module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('coinShop', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            shop: {
                type: Sequelize.JSON,
                allowNull: true,

            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}