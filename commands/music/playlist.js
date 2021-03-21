const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const usersPlaylist = new Map();
const { Client } = require("youtubei");
const duratiform = require('duratiform');
const SoundCloud = require("soundcloud-scraper");
const soundcloud = new SoundCloud.Client();
module.exports = new Command({
    name: 'playlist',
    description: 'Manage your playlist | Gerer vos playlist',
    // Optionnals :
    usage: '!playlist <add/delete/remove/import/create> <playlistName>',
    category: 'music',
    tags: ['guildOnly'],
    aliases: ['pl'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 2
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const type = args[0];
    const playlistName = args.slice(1).join(" ");
    if (!playlistName) return message.channel.send(lang.music.playlist.noPlaylistName)
    const duration = (s) => duratiform.format(s * 1000, '(h:h:)(m:mm:)(s:ss)');

    const dureefiltrer = response => { return response.author.id === message.author.id };
    const youtube = new Client();
    if (type === "add") {
        if (!usersPlaylist.has(message.author.id)) return message.channel.send(lang.music.playlist.noPlaylist)
        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName)
        if (!playlistToEdit) return message.channel.send(lang.music.playlist.notFound)
        message.channel.send(lang.music.playlist.urlQ(playlistName)).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                .then(async cld => {

                    const msg = cld.first()
                    const url = msg.embeds[0].url;
                    const urlTester = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
                    const isValid = urlTester.test(url);
                    if (!url && !isValid) return message.channel.send(lang.music.playlist.provideOnlyValidUrl)
                    const id = extractVideoID(url)
                    const awaiting = await message.channel.send(lang.loading)
                    await youtube.getVideo(id).then(async (videoInformation) => {
                        const name = videoInformation.title;
                        const thumbnail = msg.embeds[0].thumbnail.url;
                        const duration = duratiform.format(videoInformation.duration * 1000, '(h:h:)(m:mm:)(s:ss)');   // 07:36
                        const index = authorPlaylist.indexOf(playlistToEdit)

                        playlistToEdit.song.push({ name, url, thumbnail, duration });
                        authorPlaylist[index] = playlistToEdit;
                        await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(authorPlaylist)]).then(() => {
                            StateManager.emit('playlist', message.author.id, authorPlaylist);
                            awaiting.edit(lang.music.playlist.successAdd(playlistName)).then(m => {
                                setTimeout(() => {
                                    m.delete();
                                    msg.delete();
                                    mp.delete();
                                }, 2000)
                            })
                        })
                    });

                })
        })

    } else if (type === 'import') {
        if (usersPlaylist.has(message.author.id)) {
            const authorPlaylist = usersPlaylist.get(message.author.id)
            if (authorPlaylist.length > 10) {
                return message.channel.send(lang.music.playlist.toManyPlaylist)
            }
            const playlistFinder = authorPlaylist.find(playlist => playlist.name === playlistName)
            if (playlistFinder) {
                return message.channel.send(lang.music.playlist.alreadyName)
            }

        }
        message.channel.send(lang.music.playlist.urlPlaylistQ).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                .then(async cld => {

                    const msg = cld.first()
                    const url = msg.content;
                    const urlTester = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
                    const isValid = urlTester.test(url);
                    if (!url && !isValid) return message.channel.send(lang.music.playlist.provideOnlyValidUrl)
                    const id = extractPlaylistID(url)
                    const awaiting = await message.channel.send(lang.loading)
                    await youtube.getPlaylist(id).then(async (playlistInformation) => {
                        await playlistInformation.next(0);
                        let playlist = { name: playlistName, song: [] }

                        if (playlistInformation.videoCount >= 50) {
                            awaiting.edit(lang.music.playlist.playlistToLong)
                            const newPl = playlistInformation.videos.slice(0, 50);
                            for (const song of newPl) {
                                playlist.song.push({ name: song.title, url: `https://www.youtube.com/watch?v=${song.id}`, duration: duration(song.duration), thumbnail: song.thumbnails[0].url })
                            }

                        } else {
                            for (const song of playlistInformation.videos) {
                                playlist.song.push({ name: song.title, url: `https://www.youtube.com/watch?v=${song.id}`, duration: duration(song.duration), thumbnail: song.thumbnails[0].url })
                            }
                        }
                        if (usersPlaylist.has(message.author.id)) {
                            const authorPlaylist = usersPlaylist.get(message.author.id);
                            authorPlaylist.push(playlist);
                            await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(authorPlaylist)]).then(() => {
                                StateManager.emit('playlist', message.author.id, authorPlaylist);
                                awaiting.edit(lang.music.playlist.successImport(playlistName)).then(m => {
                                    setTimeout(() => {
                                        m.delete();
                                        msg.delete();
                                        mp.delete();
                                    }, 10000)
                                })
                            })
                        } else {
                            await this.connection.query(`INSERT INTO playlist VALUES ('${message.author.id}', ?)`, [JSON.stringify([playlist])]).then(() => {
                                StateManager.emit('playlist', message.author.id, [playlist]);
                                awaiting.edit(lang.music.playlist.successImport(playlistName)).then(m => {
                                    setTimeout(() => {
                                        m.delete();
                                        msg.delete();
                                        mp.delete();
                                    }, 10000)
                                })
                            })
                        }

                    });

                })
        })

    } else if (type === "delete") {

        if (!usersPlaylist.has(message.author.id)) return message.channel.send(lang.music.playlist.noPlaylist)
        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName)
        if (!playlistToEdit) return message.channel.send(lang.music.playlist.notFound)
        const newAuthorPlaylist = authorPlaylist.filter(pl => pl.name !== playlistName);
        if (newAuthorPlaylist.length === 0) {
            await this.connection.query(`DELETE FROM playlist WHERE userId = '${message.author.id}'`).then(() => {
                StateManager.emit('playlistDelete', message.author.id)
                message.channel.send(lang.music.playlist.successDelete(playlistName)).then(m => {
                    setTimeout(() => {
                        m.delete();
                        mp.delete();
                    }, 5000)
                })
            })
        } else {
            await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(newAuthorPlaylist)]).then(() => {
                StateManager.emit('playlist', message.author.id, newAuthorPlaylist);
                message.channel.send(lang.music.playlist.successDelete(playlistName)).then(m => {
                    setTimeout(() => {
                        m.delete();
                        mp.delete();
                    }, 5000)
                })
            })
        }

    } else if (type === "remove") {
        if (!usersPlaylist.has(message.author.id)) return message.channel.send(lang.music.playlist.noPlaylist)
        const authorPlaylist = usersPlaylist.get(message.author.id);
        const playlistToEdit = authorPlaylist.find(pl => pl.name === playlistName)
        if (!playlistToEdit) return message.channel.send(lang.music.playlist.notFound)
        message.channel.send(lang.music.playlist.removeQ).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                .then(async cld => {

                    const msg = cld.first()
                    const url = msg.content;
                    if (msg.content.toLowerCase() === "cancel") {
                        return await message.channel.send(lang.cancel).then(mps => {
                            setTimeout(() => {
                                mps.delete();
                                mp.delete();
                                msg.delete();
                            }, 5000)
                        })
                    }
                    const urlTester = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
                    const isValid = urlTester.test(url);
                    if (!url && !isValid) return message.channel.send(lang.music.playlist.provideOnlyValidUrl)
                    const songs = playlistToEdit.song;
                    if (songs.filter(songs => songs.url === url).length === 0) return message.channel.send(lang.music.playlist.songNotFound)
                    const newSongs = songs.filter(song => song.url !== url);
                    playlistToEdit.song = newSongs;
                    const index = authorPlaylist.indexOf(playlistToEdit)
                    authorPlaylist[index] = playlistToEdit;
                    await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(authorPlaylist)]).then(() => {
                        StateManager.emit('playlist', message.author.id, authorPlaylist);
                        message.channel.send(lang.music.playlist.successRemove(playlistName)).then(m => {
                            setTimeout(() => {
                                m.delete();
                                mp.delete();
                            }, 5000)
                        })
                    })
                })
        })
    } else if (type === "create") {
        if (usersPlaylist.has(message.author.id)) {
            const authorPlaylist = usersPlaylist.get(message.author.id)
            console.log(authorPlaylist)
            if (authorPlaylist.length > 10) {
                return message.channel.send(lang.music.playlist.toManyPlaylist)
            }
            const playlistFinder = authorPlaylist.find(playlist => playlist.name === playlistName)
            if (playlistFinder) {
                return message.channel.send(lang.music.playlist.alreadyName)
            }
        }
        message.channel.send(lang.music.playlist.createQ).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                .then(async cld => {
                    const msg = cld.first()
                    const url = msg.content;
                    const urlTester = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
                    const isValid = urlTester.test(url);
                    if (!url && !isValid && !url.includes("soundcloud.com")) return message.channel.send(lang.music.playlist.provideOnlyValidUrl);
                    if (!usersPlaylist.has(message.author.id)) {
                        let playlist = { name: playlistName, song: [] };
                        if (url.includes("soundcloud.com")) {
                            soundcloud.getSongInfo(url).then(async (song) => {
                                const songInS = song.duration * 0.001;
                                const thumbnail = song.thumbnail;
                                const formatedDuration = duration(songInS);
                                playlist.song.push({name: song.title, url, duration: formatedDuration, thumbnail });
                                await this.connection.query(`INSERT INTO playlist VALUES ('${message.author.id}', ?)`, [JSON.stringify([playlist])]).then(() => {
                                    StateManager.emit('playlist', message.author.id, [playlist]);
                                    message.channel.send(lang.music.playlist.successCreate(playlistName)).then(m => {
                                        setTimeout(() => {
                                            m.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 5000)
                                    })
                                })
                            })
                        } else {
                            const id = extractVideoID(url)
                            await youtube.getVideo(id).then(async (videoInformation) => {
                                const name = videoInformation.title;
                                const thumbnail = msg.embeds[0].thumbnail.url;
                                const durationFormated = duration(videoInformation.duration) // 07:36

                                playlist.song.push({ name, url, thumbnail, duration:durationFormated });
                                await this.connection.query(`INSERT INTO playlist VALUES ('${message.author.id}', ?)`, [JSON.stringify([playlist])]).then(() => {
                                    StateManager.emit('playlist', message.author.id, [playlist]);
                                    message.channel.send(lang.music.playlist.successCreate(playlistName)).then(m => {
                                        setTimeout(() => {
                                            m.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 5000)
                                    })
                                })
                            });
                        }
                    } else if(usersPlaylist.has(message.author.id)) {
                        let playlist = usersPlaylist.get(message.author.id);
                        let tempPlaylist =  { name: playlistName, song: [] };
                        if (url.includes("soundcloud.com")) {
                            soundcloud.getSongInfo(url).then(async (song) => {
                                const songInS = song.duration * 0.001;
                                const thumbnail = song.thumbnail;
                                const formatedDuration = duration(songInS);
                                tempPlaylist.song.push({name: song.title, url, duration: formatedDuration, thumbnail });
                                playlist.push(tempPlaylist)
                                await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(playlist)]).then(() => {
                                    StateManager.emit('playlist', message.author.id,playlist);
                                    awaiting.edit(lang.music.playlist.successCreate(playlistName)).then(m => {
                                        setTimeout(() => {
                                            m.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 5000)
                                    })
                                })
                            })
                        } else {
                            const id = extractVideoID(url)
                            const awaiting = await message.channel.send(lang.loading)
                            await youtube.getVideo(id).then(async (videoInformation) => {
                                const name = videoInformation.title;
                                const thumbnail = msg.embeds[0].thumbnail.url;
                                const durationFormated = duration(videoInformation.duration) // 07:36

                                tempPlaylist.song.push({ name, url, thumbnail, duration:durationFormated });
                                playlist.push(tempPlaylist)
                                
                                await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId = '${message.author.id}'`, [JSON.stringify(playlist)]).then(() => {
                                    StateManager.emit('playlist', message.author.id,playlist);
                                    awaiting.edit(lang.music.playlist.successCreate(playlistName)).then(m => {
                                        setTimeout(() => {
                                            m.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 5000)
                                    })
                                })
                            });
                        }
                    }

                })
        })
    }
});

function extractVideoID(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
    }
}
function extractPlaylistID(url) {
    const regPlaylist = /[&?]list=([^&]+)/i;
    match = url.match(regPlaylist);
    return match[1]
}
embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('playlist', (userId, playlist) => {
    usersPlaylist.set(userId, playlist)
})
StateManager.on('playlistDelete', (userId) => {
    usersPlaylist.delete(userId)
})