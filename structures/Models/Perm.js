module.exports = (Sequelize, oneforall) => {
    try {
        oneforall.database.define('perm', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            perm1: {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            perm1Command : {
                type: Sequelize.TEXT,
                allowNull : false,
                defaultValue: ''
            },
            perm2: {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            perm2Command : {
                type: Sequelize.TEXT,
                allowNull : false,
                defaultValue: ''
            },

            perm3: {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            perm3Command : {
                type: Sequelize.TEXT,
                allowNull : false,
                defaultValue: ''
            },

            perm4: {
                type: Sequelize.STRING(25),
                allowNull: true,
            },
            perm4Command : {
                type: Sequelize.TEXT,
                allowNull : false,
                defaultValue: ''
            },
            setup : {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            isOn : {
                type:Sequelize.BOOLEAN,
                defaultValue: false
            }
        })
        return oneforall.database.models

    } catch (e) {
        console.log(e)
    }
}