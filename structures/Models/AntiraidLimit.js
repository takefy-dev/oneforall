module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('antiraidLimit', {
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
                allowNull: false,
            },
            antiDeco : {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            antiMassBan : {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            antiMassKick : {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}