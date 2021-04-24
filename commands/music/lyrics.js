const lyricsFinder = require("lyrics-finder");

const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'lyrics',
            description: 'Get the lyrics of current playing music | Afficher les paroles de la music',
            usage: '!lyrics',
            category: 'music',
            aliases: ['ly'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        let lyrics = null;
        try {
            lyrics = await lyricsFinder(queue.songs[0].name, "");
            if (!lyrics) lyrics = `${lang.music.lyrics.notFound} ${queue.songs[0].name}.`;
        } catch (error) {
            console.log(error)
            lyrics = `${lang.music.lyrics.notFound} ${queue.songs[0].name}.`;
        }

        let lyricsEmbed = new Discord.MessageEmbed()
            .setTitle("Lyrics")
            .setDescription(lyrics)
            .setColor(`${color}`)
            .setTimestamp();

        if (lyricsEmbed.description.length >= 2048)
            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch(console.error);
    }
}