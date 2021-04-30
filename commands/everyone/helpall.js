const {MessageEmbed} = require("discord.js"),
    pagination = require('discord.js-pagination')
fs = require("fs");

const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'helpall',
            description: 'Affiche toutes les commandes',
            usage: 'helpall',
            category: 'everyone',
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const lang = client.lang(message.guild.lang)
        const color = message.guild.color

        if (!message.guild) return;
        let embed2 = new MessageEmbed()
            .setAuthor(lang.helpall.botOwner)
            .setColor(`${color}`)
            .setDescription('\`setlang\`\n\`owner add\`\n\`owner remove\`\n\`owner clear\`\n\`owner list\`\n\`setname\`\n\`setavatar\`\n\`setactivity\`\n\`blacklist add\`\n\`blacklist remove\`\n\`blacklist list\`\n\`blacklist on\`\n\`blacklist off\`')
        //message.channel.send(embed2)
        let embed3 = new MessageEmbed()
            .setAuthor(lang.helpall.moderation)
            .setColor(`${color}`)
            .setDescription('\`soutien config\`\n\`soutien count\`\n\`invite config\`\n\`allbans\`\n\`alladmins\`\n\`lock all off\`\n\`lock all on\`\n\`lock off\`\n\`lock on\`\n\`clear\`\n\`kick\`\n\`ban\`\n\`unban all\`\n\`tempban\`\n\`tempmute\`\n\`unban\`\n\`massrole add\`\n\`massrole remove\`\n\`role add\`\n\`role remove\`\n\`webhook size\`\n\`webhook delete\`\n\`nuke\`\n\`setcolor\`\n\`setprefix\`\n\`setup\`\n\`dero\`')
        let embed4 = new MessageEmbed()
            .setAuthor(lang.helpall.antiriraid)
            .setColor(`${color}`)
            .setDescription('\`antiraid on\`\n\`antiraid off\`\n\`antiraid config\`\n\`antiraid opti\`\n\`antiraid antispam on\`\n\`antiraid antispam off\`\n\`antiraid antilink on\`n\`antiraid antilink off\`\n\`setlogs\`\n\`wl add\`\n\`wl remove\`\n\`wl clear\`\n\`\wl list\`\n\`addemoji\`\n\`removeemoji\`')
        //message.channel.send(embed4)
        let embed5 = new MessageEmbed()
            .setAuthor(lang.helpall.giveaway)
            .setColor(`${color}`)
            .setDescription('\`gstart\`\n\`greroll\`')
        let embed6 = new MessageEmbed()
            .setAuthor(`Liste des commandes de Backup`)
            .setColor(`${color}`)
            .setDescription('\`backup create\`\n\`backup delete\`\n\`backup list\`\n\`backup info\`')
        let embed7 = new MessageEmbed()
            .setAuthor(lang.helpall.reactrole)
            .setColor(`${color}`)
            .setDescription('\`embed\`\n\`reactrole\`')
        let embed8 = new MessageEmbed()
            .setAuthor(lang.helpall.general)
            .setColor(`${color}`)
            .setDescription('\`support\`\n\`addbot\`\n\`vocal\`\n\`authorinfo\`\n\`pic\`\n\`ping\`\n\`botinfo\`\n\`serverinfo\`\n\`userinfo\`\n\`invite count\`\n\`snipe\`')
        const pages = [
            embed2,
            embed3,
            embed4,
            embed5,
            embed6,
            embed7,
            embed8
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}
