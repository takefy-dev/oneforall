module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('maintenance', {
            client: {
              type: Sequelize.STRING(25),

            },
            enable : {
                type : Sequelize.BOOLEAN,
                defaultValue: false
            }
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}