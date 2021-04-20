module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('members', {
            id: {
              type: Sequelize.INTEGER(),
              autoIncrement: true,
                primaryKey: true
            },
            guildID : {
                type: Sequelize.STRING(25),
                allowNull: false,
            },
            userID :{
              type: Sequelize.STRING(25),
              allowNull: false,
            },
            coins : {
                type: Sequelize.FLOAT(255,2),
                allowNull: false,
                defaultValue: 0
            },
            health :{
              type: Sequelize.INTEGER(3),
              allowNull: false,
              defaultValue: 100
            },
            food :{
                type: Sequelize.INTEGER(3),
                allowNull: false,
                defaultValue: 100
            },
            inventory : {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {items: ['']}
            }

        })
        return oneforall.database.models;

    }catch (e) {
        console.log(e)
    }
}