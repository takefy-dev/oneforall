module.exports = {

    name: 'connect',


    run: async (websocket) => {
        console.log(`Logged in as ${websocket.id}`)
    }
}
