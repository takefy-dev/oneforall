const usersPlaylist = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'myplaylist',
            description: 'show your save playlist | Affiche vos playlist sauvegardé',
            usage: '!myplaylist [playlistName]',
            category: 'music',
            aliases: ['mp'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const authorPlaylist = usersPlaylist.get(message.author.id);
        if (!args[0]) {
            const playlist = !authorPlaylist ? `No playlist` : authorPlaylist.map((pl, i) => `${i + 1}. ${pl.name}\n`);
            const embed = new Discord.MessageEmbed()
                .setDescription(playlist)
                .setColor(`${color}`)
            message.channel.send(embed)
        } else if (authorPlaylist) {
            const playlistName = args.slice(0).join(" ");
            console.log(authorPlaylist)
            const lookPl = authorPlaylist.find(pl => pl.name === playlistName);
            console.log(playlistName, lookPl)
            if (lookPl) {
                const songs = lookPl.song

                const embed = new Discord.MessageEmbed()
                    .setAuthor(`Playlist ${playlistName} (${songs.length} songs)`, message.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`${songs.map((song, i) => `${i + 1} - [${song.name}](${song.url}) \`${song.duration}\``).slice(0, 20).join("\n")}\n${songs.length > 20 ? `+ ${songs.length - 20}other songs` : ''}`)
                    .setColor(`${color}`)
                message.channel.send(embed)
            }
        } else {
            message.channel.send("No playlist");
        }


    }
}