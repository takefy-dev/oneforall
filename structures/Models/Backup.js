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
                type : Sequelize.TEXT,
                allowNull: false
            },
            guildData : {
                type: Sequelize.JSON,
                allowNull: true
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}