module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('tempvoc', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            tempvocInfo : {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {catId: "Non définie", chId: "Non définie", chName: "Non définie", isOn: false}
            },






        })
        return oneforall.database.models
    }catch (e) {
        console.log(e)
    }
}