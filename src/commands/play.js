const ytdl = require('ytdl-core');
const Discord = require('discord.js');

exports.default = executePlay;

function executePlay(msg, channel) {
	if (!channel.connection) {
		return msg.channel.send('⛔ **Call me to join into a voice channel with !join**');
	}

	if (channel.isPlaying) {
		return msg.channel.send('⛔ **I\'m currently playing a song...**');
	}

	const song = channel.queue.shift();
	if (!song) {
		channel.isPlaying = false;
		return msg.channel.send('⛔ There isn\'t songs to play');
	}

	channel.isPlaying = true;
	play(msg, channel, song);
}

async function play(msg, channel, song) {
	channel.currentSong = song;

	if (!song) {
		channel.isPlaying = false;
		return;
	}

	const dispatcher = channel.connection
		.play(ytdl(song.url, { type: 'opus' }))
		.on('finish', () => play(msg, channel, channel.queue.shift()))
		.on('error', (e) => console.log(e));
    
	msg.channel.send(new Discord.MessageEmbed()
		.setColor('#1283F0')
		.setThumbnail(song.thumbnail)
		.setTitle('🎵 Now Playing:')
		.setDescription(`[${song.title}](${song.url}) \`${song.duration}\``));
	dispatcher.setVolumeLogarithmic(channel.volume / 5);
}