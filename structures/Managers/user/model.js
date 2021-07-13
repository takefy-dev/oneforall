module.exports =  (database, DataTypes, modelName, config) => {
    try {
        database.define(modelName, {
            guildId: {
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: false

            },
            userId: {
                type: DataTypes.STRING(25),
                allowNull: false
            },
            invite : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {join:0, leave:0, fake: 0, bonus: 0}
            },
            antiraidLimit : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {ban : 0, deco: 0, kick:0}
            }


        }, {
            tableName: modelName,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
        return database.models[modelName]
    } catch (e) {
        console.log(e)
    }
}