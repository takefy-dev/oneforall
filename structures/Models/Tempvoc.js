module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('tempvoc', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            tempvocInfo : {
                type: Sequelize.TEXT,
                allowNull: false,
                get: function () {
                    return JSON.parse(this.getDataValue('tempvocInfo'));
                },
                set: function (value) {
                    return this.setDataValue('tempvocInfo', JSON.stringify(value));
                },
                defaultValue: {catId: "Non définie", chId: "Non définie", chName: "Non définie", isOn: false}
            },






        })
        return oneforall.database.models
    }catch (e) {
        console.log(e)
    }
}