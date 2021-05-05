module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('inventory', {
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
            inventory: {
                type: Sequelize.TEXT("long"),
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('inventory'));
                },
                set: function (value) {
                    this.setDataValue('inventory', JSON.stringify(value));
                },
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}