module.exports =  (database, DataTypes, modelName, config) => {
    try {
        database.define(modelName, {
            userId : {
                type : DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            enable : {
                type : DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blacklisted: {
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