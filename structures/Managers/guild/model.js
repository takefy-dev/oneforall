module.exports =  (database, DataTypes, modelName, config) => {
    try {
        database.define(modelName, {
            guildId: {
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            prefix: {
                type: DataTypes.STRING(1),
                allowNull: false,
                defaultValue: config.prefix
            },
            antiraid : {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: config.defaultAntiraidConfig
            },
            antiraidLimits : {
              type: DataTypes.JSON,
              allowNull: true,
              defaultValue: {
                  antiToken : {recentJoined: [], counter:0}
              }
            },
            muteRoleId: {
                type: DataTypes.STRING(25),
                allowNull: true,
            },
            color: {
                type: DataTypes.STRING(7),
                allowNull: false,
                defaultValue: "#36393F",
            },
            setup: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            whitelisted: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: []
            },
            memberRole: {
                type: DataTypes.STRING(25),
                allowNull: true
            },
            invite : {
                type: DataTypes.JSON,
                allowNull: true,
            },
            soutien :{
                type : DataTypes.JSON,
                allowNull: true,

            },
            owners: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            lang: {
                type: DataTypes.STRING(2),
                allowNull: false,
                defaultValue: "fr"
            },
            logs : {
                type: DataTypes.JSON,
                allowNull: false,

            },
            counter: {
              type: DataTypes.JSON,
              allowNull: true,
            },
            warns : {
                type: DataTypes.JSON,
                allowNull: true,
            },
            tempvoc : {
                type: DataTypes.JSON,
                allowNull: true,
            },
            perms : {
                type : DataTypes.JSON,
                allowNull: true,

            },
            reactroles : {
                type : DataTypes.JSON,
                allowNull: true,
            },
            piconly : {
                type: DataTypes.JSON,
                allowNull: true,

            },
            coinsSettings : {
                type: DataTypes.JSON,
                allowNull: true
            },
            coinsShop : {
                type: DataTypes.JSON,
                allowNull: true,
            },
            reactionsToMessages : {
                type: DataTypes.JSON,
                allowNull: true
            },
            xp: {
                type: DataTypes.JSON,
                allowNull: true
            },
            level : {
                type: DataTypes.JSON,
                allowNull: true
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
