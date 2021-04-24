const usersPlaylist = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'playnow',
            description: 'Play a song now| Jouer une music en skippant la queue',
            usage: '!playnow <url/title/playlistName>',
            category: 'music',
            aliases: ['pn', 'pnow'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const musicName = args.join(" ");
        if (!musicName) return message.channel.send(lang.music.play.noMusic);
        if (usersPlaylist.has(message.author.id)) {
            const authorPlaylist = usersPlaylist.get(message.author.id);
            let wantedPlaylist = authorPlaylist.filter(pl => pl.name === musicName);
            console.log(wantedPlaylist.length)
            if (!wantedPlaylist || wantedPlaylist.length === 0) {
                try {
                    await client.music.playSkip(message, musicName).catch(err => console.log(err))

                } catch (e) {
                    console.error(e)
                    message.channel.send(`Error ${e}`)
                }
            } else {
                const songs = [];
                const songsPropertie = wantedPlaylist[0].song
                for (let song of songsPropertie) {
                    songs.push(song.url)
                }
                console.log(songs)
                try {
                    await client.music.playCustomPlaylist(message, songs, {name: wantedPlaylist[0].name}, true, true);
                } catch (e) {
                    console.error(e)
                    message.channel.send(`Une erreur est survenue`)
                }
            }
        } else {
            try {
                await client.music.playSkip(message, musicName).catch(err => console.log(err))

            } catch (e) {
                console.error(e)
                message.channel.send(`Une erreur est survenue`)
            }
        }

    }
}