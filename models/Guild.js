module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('guildConfig', {
            guildID : {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            prefix : {
                type: Sequelize.STRING(1),
                allowNull: false,
                defaultValue: oneforall.config.prefix
            },
            lang :{
                type: Sequelize.STRING(2),
                allowNull: false,
                defaultValue: 'fr'
            },
            color : {
                type: Sequelize.STRING(7),
                allowNull: false,
                defaultValue: '#EECE32'
            },
            owners:{
              type: Sequelize.TEXT(),
                allowNull: false,
                defaultValue: ''
            },
            logs : {
                type: Sequelize.STRING(25),
                allowNull: true
            }
        })
        return oneforall.database.models;

    }catch (e) {
        console.log(e)
    }
}