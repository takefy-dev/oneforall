module.exports = {
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),

    updateOrCreate(model, where, newItem) {
        return new Promise((resolve, reject) => {
            model.findOne({where}).then(foundItem => {
                if (!foundItem)
                    model.create(newItem).then(item => resolve({item, created: true})).catch(e => reject(e))
                else
                    model.update(newItem, {where}).then(item => resolve({item, created: false})).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    },
    async loadTable(manager, data = {}) {
        await this.sleep(500);
        for await (const element of (await manager.OneForAll.database.models[data.model].findAll()))
            manager[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
        console.log(`Successfully loaded ${manager.size} ${data.model.charAt(0).toUpperCase()}${data.model.slice(1)}`)


        return manager;
    },
    async copyObject(object){
        return JSON.parse(JSON.stringify(object));
    }
}