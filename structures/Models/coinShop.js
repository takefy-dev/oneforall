module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('coinShop', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            shop: {
                type: Sequelize.TEXT,
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('shop'));
                },
                set: function (value) {
                    this.setDataValue('shop', JSON.stringify(value));
                },

            }
        }, {
            tableName: 'coinShop'
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}