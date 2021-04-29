const Discord = require("discord.js");

const { Logger } = require('advanced-command-handler');
const StateManager = require("../../utils/StateManager");
const usersPlaylist = new Map();
module.exports = {
    async musicEvent(music, client) {
        Logger.log(`${Logger.setColor('blue')} Events launch`, 'music')
        const guildColor = (message) => message.guild.color
        const gLang = (message) => client.lang(message.guild.lang)
        const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

        // when music is start playing
        music.on("playSong", async (message, queue, song) => {
            const likes = song.likes.toLocaleString();
            const dislikes = song.dislikes.toLocaleString();
            const reposts = song.reposts.toLocaleString();
            const view = song.views.toLocaleString();
            const name = song.name;
            const lang = gLang(message)

            const url = song.url;
            const thumbnail = song.thumbnail;
            const requestedBy = song.user;
            const averageRate = !song.info ? lang.music.noAvgRate : parseFloat(song.info.videoDetails.averageRating).toFixed(1);
            const category = !song.info ? lang.music.noAvgRate : song.info.videoDetails.category;

            const queueStatus = status(queue); //
            const color = guildColor(message)
            let nowPlaying = new Discord.MessageEmbed()
                .setAuthor('Playing ♪', 'https://cdn.discordapp.com/attachments/820031925389230110/822494236007596082/3dgifmaker81211.gif', 'https://www.one4all.fr')
                .setDescription(`<:title:783422216095793172> Title: [**${name}**](${url})\n<:asked:822506067639926804> Requested by: **${requestedBy}**\n:eyes: Views: **${view}**\n<:like:822504740519673856> Likes: **${likes}**\n<:dislike:822504631967678494> Dislikes: **${dislikes}**\n<:cateogry:822505206801498132> Category: **${category}**\n<:rate:822505460447051796> Average Rate: **${averageRate}**\n<a:reupload:822505791759712266> Reposts: **${reposts}**`)
                .addField(`Queue status:`, queueStatus, false)
                .setImage(thumbnail)
                .setColor(`${color}`)
                .setFooter(`${lang.music.requestedBy} ${requestedBy.username}#${requestedBy.discriminator}`, requestedBy.displayAvatarURL({ dynamic: true }))

            message.channel.send(nowPlaying);
            //if its a stream
            if (song.isLive) {
                nowPlaying.addField("\u200b", "🔴 LIVE", false);
                //send approve msg
                return message.channel.send(nowPlaying);
            }

        })



        // when a song is added to the queue
        music.on("addSong", (message, queue, song) => {

            const name = song.name;
            const url = song.url;
            const lang = gLang(message)
            const timeOfSong = song.formattedDuration; // the duration of the song
            const color = guildColor(message)

            const embed = new Discord.MessageEmbed()
                .setDescription(lang.music.events.addToQueue.add(name, timeOfSong, url))
                .setColor(`${color}`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            message.channel.send(embed)


        })

        // add playlist

        music.on('addList', async (message, queue, playlist) => {
            const lang = gLang(message)
            const color = guildColor(message)
            const nameOfPl = playlist.name;
            const embed = new Discord.MessageEmbed()
                .setDescription(lang.music.events.playlist.addToQueue(nameOfPl))
                .setColor(`${color}`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            message.channel.send(embed)
        })

        // when the playlist start
        music.on("playList", async (message, queue, playlist, song) => {
            this.connection = StateManager.connection;
            const lang = gLang(message)
            const color = guildColor(message)
            const nameOfPl = playlist.name;
            if (usersPlaylist.has(message.author.id) && !usersPlaylist.get(message.author.id).find(pl => pl.name === nameOfPl)) {

                const authorPlaylist = usersPlaylist.get(message.author.id)
                if (authorPlaylist.length > 10) {
                    return message.channel.send(lang.music.playlist.toManyPlaylist)
                }
                const playlistFinder = authorPlaylist.find(playlist => playlist.name === nameOfPl)
                if (playlistFinder) {
                    return message.channel.send(lang.music.playlist.alreadyName)
                }

                const msg = await message.channel.send(lang.loading)
                const emoji = ['✅', '❌']
                for (const em of emoji) await msg.react(em)
                const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id;
                dureefiltrer = response => { return response.author.id === message.author.id };

                const embed = new Discord.MessageEmbed()
                    .setDescription(lang.music.importPlaylist.description)
                    .setColor(`${color}`)
                    .setFooter(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                msg.edit('', embed).then(async m => {
                    const collector = m.createReactionCollector(filter, { time: 120000 });
                    collector.on('collect', async r => {
                        r.users.remove(message.author);
                        if (r.emoji.name === emoji[0]) {
                            // if(playlist.songs.length >= 35) return message.channel.send(lang.music.importPlaylist.toManySongs)

                            message.channel.send(lang.music.importPlaylist.nameQ).then(mp => {
                                mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        const name = cld.first().content;
                                        let playlists = usersPlaylist.get(message.author.id);
                                        let songsList = [];
                                        for (const song of playlist.songs) {
                                            songsList.push({ name: song.name, url: song.url, duration: song.formattedDuration, thumbnail: song.thumbnail })
                                        }
                                        if (!playlists) {
                                            playlists = [{ name, song: songsList }]

                                            await this.connection.query(`INSERT INTO playlist VALUES ('${message.author.id}', ?)`, [JSON.stringify(playlists)]).then(() => {
                                                StateManager.emit('playlist', message.author.id, playlists);
                                                message.channel.send(lang.music.importPlaylist.success).then(m => {
                                                    setTimeout(() => {
                                                        mp.delete()
                                                        m.delete();
                                                        cld.first().delete();
                                                    }, 2000)
                                                })
                                            })
                                        } else {

                                            playlists.push({ name, song: songsList })

                                            await this.connection.query(`UPDATE playlist SET playlist = ? WHERE userId ='${message.author.id}'`, [JSON.stringify(playlists)]).then(() => {
                                                StateManager.emit('playlist', message.author.id, playlists);
                                                message.channel.send(lang.music.importPlaylist.success).then(m => {
                                                    setTimeout(() => {
                                                        mp.delete()
                                                        m.delete();
                                                        cld.first().delete();
                                                    }, 2000)
                                                })
                                            })
                                        }
                                        collector.stop();


                                    });
                            })
                        } else {
                            await message.channel.send(lang.cancel);
                            collector.stop();
                        }
                    })

                })
            } else {
                console.log(playlist.songs.lenght)
                const embed = new Discord.MessageEmbed()
                    .setDescription(lang.music.events.playlist.play(nameOfPl, playlist.songs.length))
                    .setColor(`${color}`);
                message.channel.send(embed)
            }


        })



        //error 
        music.on("error", (message, error) => {
            console.error(error)
            message.channel.send(`Une ereur est survenue`)
        })

        // when nobody is in voicechat
        music.on("empty", (message) => {
            const lang = gLang(message)

            message.channel.send(lang.music.events.empty)
        })
        music.on("noRelated", message => {
            message.channel.send("Can't find related video to play. Stop playing music.")
        });

    }
}
