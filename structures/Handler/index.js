const fs = require('fs');

class EventHandler {
    constructor(oneforall) {
        this.oneforall = oneforall;
        this.getFiles("events")
    }
    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            this.oneforall.Logger.info(`Loading ${files.length} events in category`, `Starting`)
            if (err) throw err;
            files.forEach(file => {

                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js')) {
                    this.oneforall.Logger.comment(`${this.oneforall.Logger.setColor('green', `Bind: ${file.split('.js')[0]}`)}`, `Binding events`)
                    return this.registerFile(`${path}/${file}`, this.oneforall);
                }
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const event = require(`../../${file}`);
        this.oneforall.on(event.name, (...args) => event.run(this.oneforall, ...args));
        delete require.cache[require.resolve(`../../${file}`)];
    }
}

class SlashCommandHandler {
    constructor(oneforall) {
        this.oneforall = oneforall;
        this.getFiles("slashCommands");
    }

    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith(".disabled")) return;
                if (file.endsWith(".js"))
                    return this.registerFile(`${path}/${file}`, this.oneforall);
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const pull = require(`../${file}`);
        if (pull.name)
            this.oneforall.slashCommand.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(`../${file}`)];
    }
}

class CommandHandler {
    constructor(oneforall) {
        this.oneforall = oneforall;
        this.getFiles("commands");
    }

    getFiles(path) {
        fs.readdir(`${path}`, (err, files) => {
            this.oneforall.Logger.info(`Loading ${files.length} commands in category`, `Starting`)
            if (err) throw err;
            files.forEach(file => {
                if (file.endsWith('.disabled')) return;
                if (file.endsWith('.js')) {
                    this.oneforall.Logger.comment(`${this.oneforall.Logger.setColor('green', `Load: ${file.split('.js')[0]}`)}`, `Loading commands`)
                    return this.registerFile(`${path}/${file}`, this.oneforall)
                }
                if (!file.includes("."))
                    this.getFiles(`${path}/${file}`);
            })
        })
    }

    registerFile(file) {
        const pull = require(`../../${file}`);
        if (pull.name)
            this.oneforall.commands.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(`../../${file}`)];
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => this.oneforall.aliases.set(alias.toLowerCase(), pull.name));
    }
}

module.exports = {
    EventHandler,
    CommandHandler,
    SlashCommandHandler
}
