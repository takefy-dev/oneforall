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
            backupEmbed: {
                type : DataTypes.JSON,
                allowNull: false,
                defaultValue: '[]'
            },
            backupRoles: {
                type : DataTypes.JSON,
                allowNull: false,
                defaultValue: '[]'
            }
        }, {
            tableName: modelName,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
       database.models[modelName].sync({
           alter: true
       })
        return database.models[modelName]
    } catch (e) {
        console.log(e)
    }
}