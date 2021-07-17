module.exports =  (database, DataTypes, modelName, config) => {
    try {
        database.define(modelName, {
            userId : {
                type : DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            backup : {
                type : DataTypes.JSON,
                allowNull: false,
            },
            embedBackup: {
                type : DataTypes.JSON,
                allowNull: false,
                defaultValue: '[]'
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