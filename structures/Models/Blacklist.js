module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('blacklist', {
            userId : {
                type : Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            isOn : {
                type : Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blacklisted: {
                type : Sequelize.TEXT("text"),
                allowNull: false,
                defaultValue: ''
            }
        }, {
            tableName: 'blacklist'
        })
        return oneforall.database.models
    }catch (e) {
        console.log(e)
    }
}