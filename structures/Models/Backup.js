module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('backup', {
            id: {
                type: Sequelize.INTEGER(1),
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId : {
              type : Sequelize.STRING(25),
              allowNull : false
            },
            backupId : {
                type : Sequelize.STRING(25),
                allowNull: false
            },
            guildName : {
                type : Sequelize.TEXT("long"),
                allowNull: false
            },
            guildData : {
                type: Sequelize.TEXT('long'),
                allowNull: true,
                get: function () {
                    return JSON.parse(this.getDataValue('guildData'));
                },
                set: function (value) {
                    return this.setDataValue('guildData', JSON.stringify(value));
                },
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}