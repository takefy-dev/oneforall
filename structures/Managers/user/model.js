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
            },
            mute : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {muted: false, createdAt: new Date(), expireAt: null}
            },
            warns : {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: '[]'
            },
            coins: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            inventory :{
                type: DataTypes.JSON,
                allowNull: true,
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