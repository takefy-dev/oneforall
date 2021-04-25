const { Collection, Client } = require('discord.js');
const { Sequelize } = require('sequelize');
const config = require('../../config')
const logs = require('discord-logs')
const fs = require('fs')
const { Logger } = require('advanced-command-handler')
const Distube = require('distube');
module.exports = class OneForAll extends Client{
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.owners = config.owners;
        this.cooldown = new Collection();
        this.database = new Sequelize(config.database.name, config.database.user, config.database.password,{
            dialect: 'mysql',
            define: {
                charset: "utf8",
                collate: "utf8_general_ci",
                timestamps: false,
                freezeTableName: true,

            },
            pool: {
                max: 9999999,
                min: 0,
                acquire: 60000,
                idle: 10000
            },
            logging: false
        })
        logs(this)
        this.login(config.token);
        this.loadCommands();
        this.loadEvents();
        this.initDatabase()
        this.botperso = config.botperso;
        this.music = new Distube(this, { searchSongs: false, leaveOnEmpty: true});

    }
    lang(translate){
        return require(`../../lang/${translate}`);
    }


    loadCommands(){
        const commmandsFolder = fs.readdirSync('./commands/').filter(name => name !== 'oneforallCoins' && name !== 'stats');
        Logger.info(`Loading ${commmandsFolder.length} category`, `Starting`)

        for (const category of commmandsFolder){

            const commandFiles = fs.readdirSync(`./commands/${category}/`).filter(file => file.endsWith('.js'));
            Logger.comment(`${Logger.setColor('red', `Loading: ${commandFiles.length} in ${category}`)}`, `Loading commands`)

            for (const file of commandFiles){
                const CommandFile = require(`../../commands/${category}/${file}`)
                const Command = new CommandFile();
                this.commands.set(Command.name, Command);
                for(const alias of Command.aliases){
                    this.aliases.set(alias, Command)
                }

                Logger.comment(`${Logger.setColor('green', `Loaded: ${Command.name}`)}`, `Loading commands`)
            }
        }
    }
    loadEvents(){
        const eventsFile = fs.readdirSync('./events/').filter(file => file.endsWith('.js'))
        Logger.info(`Loading ${eventsFile.length} events`, `Starting`)

        for (const event of eventsFile){

            const EventFile = require(`../../events/${event}`);
            const Event = new EventFile(this);
            this.on(Event.name, (...args) => Event.run(this, ...args))
            this.events.set(Event.name, Event);

            Logger.comment(`${Logger.setColor('green', `Bind: ${event.split('.js')[0]}`)}`, `Binding events`)
        }
    }

    initDatabase(){
        this.database.authenticate().then(async () => {
            const modelsFile = fs.readdirSync('./structures/models');
            for await (const model of modelsFile){
                await require(`../models/${model}`)(Sequelize, this)
                Logger.log(`${Logger.setColor(`red`, `${model.split('.')[0]}`)}`, 'LOADED DATABASE')
            }
            await this.database.sync({
                alter: true,
                force: false
            })
        })
    }

    isOwner(checkId){
        return !!this.owners.includes(checkId)
    }
}