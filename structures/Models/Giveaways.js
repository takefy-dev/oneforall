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
                allowNull: false,
                
            },
            data: {
                type: Sequelize.TEXT("long"),
                allowNull: false,
                get: function () {
                    return JSON.parse(this.getDataValue('data'));
                },
                set: function (value) {
                    return this.setDataValue('data', JSON.stringify(value));
                },
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}