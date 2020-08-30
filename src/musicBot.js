const youtubeScraper = require('./youtubeScraper');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');

module.exports = musicBot;

const INITIAL_ROOM = {
	queue: [],
	isPlaying: false,
	volume: 5,
	connection: null,
	voiceChannel: null,
	currentSong: null
};

function musicBot(client) {
	const channels = new Map();

	(function startEvents() {

		client.on('ready', () => {
			console.log(`Logged in as ${client.user.tag}!`);
		});

		client.on('message', async (msg) => {
			if (msg.content[0] !== '!') return;
			console.log(msg.content);

			const args = msg.content.substring(1).split(' ');
			const msgParsed = args[0];
			const params = args.slice(1).join(' ');

			let channel = channels.get(msg.guild.id);
			if (!channel) {
				channel = { ...INITIAL_ROOM };
				channels.set(msg.guild.id, channel);
			}

			switch (msgParsed) {
			case 'add':
				add(params, msg, channel);
				break;
			case 'queue':
				getQueue(msg, channel);
				break;
			case 'dequeue':
				dequeue(msg, channel.queue);
				break;
			case 'play':
				executePlay(msg, channel);
				break;
			case 'skip':
				skip(msg, channel);
				break;
			case 'join':
				join(msg, channel);
				break;
			case 'stop':
				stop(msg, channel);
				break;
			case 'disconnect':
				disconnect(msg);
				break;
			}
		});

		client.login(process.env.DISCORD_TOKEN);
	})();

	function getQueue(msg, channel) {
		const { queue } = channel;

		const songsInfo = new Discord.MessageEmbed()
			.setColor('#1283F0')
			.setTitle('🎶 QUEUE 🎶');
			

		if (channel.isPlaying) {
			songsInfo
				.addFields({
					name: '🎵 Now Playing:',
					value: `[${channel.currentSong.title}](${channel.currentSong.url})`
				});
		}
		queue.forEach((song, i) => {
			songsInfo.addFields({
				name: '\u200B',
				value: `\`${i + 1}.\` [${song.title}](${song.url})`
			});
		});

		songsInfo.setFooter(`${queue.length} songs in queue.`);
		msg.channel.send(songsInfo);
	}

	async function add(songName, msg, channel) {
		if (!songName) {
			msg.channel.send('⛔ You must indicate a group name or a song name.');
			return;
		}

		const song = await youtubeScraper.getSong(songName);
		channel.queue.push(song);
		channels.set(msg.guild.id, channel);

		msg.channel.send(`✅ *${song.title}* ***enqueued***`);
	}

	async function dequeue(msg, queue) {
		const video = queue.pop();
		if (!video) {
			msg.channel.send('⛔ **There is no songs to dequeue.**');
		} else {
			msg.channel.send(`⛔ ***\`${video.title}\`*** **has been removed.**`);
		}
	}

	async function join(msg, channel) {
		const voiceChannel = msg.member.voice.channel;
		channel.voiceChannel = voiceChannel;
		channels.set(msg.guild.id, channel);

		if (!voiceChannel) {
			return msg.channel.send('⛔ **You need to be in a voice channel to play music!**');
		}

		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return msg.channel.send('⛔ ***I need you to grant me permissions to join and speak***!');
		}

		try {
			const connection = await voiceChannel.join();
			channel.connection = connection;
		} catch (e) {
			console.log(e);
			channels.delete(msg.guild.id);
		}
	}

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
		
		msg.channel.send(`🎵 Playing ***${song.title}***\n${song.url}`);
		dispatcher.setVolumeLogarithmic(channel.volume / 5);
	}

	function skip(msg, channel) {
		if (!msg.member.voice.channel) {
			return msg.channel.send('⛔ **You have to be in a voice channel to skip the music!**');
		}
		if (!channel.currentSong) {
			return msg.channel.send('⛔ **There is no songs to skip!**');
		}
		msg.channel.send(`**Skipping** ***${channel.currentSong.title}***\n\n`);
		channel.connection.dispatcher.end();
	}

	function stop(msg, channel) {
		if (!msg.member.voice.channel) {
			return msg.channel.send('⛔ **You have to be in a voice channel to stop the music!**');
		}
		msg.channel.send('🔇 **Stopping the music...**');
		channel.isPlaying = false;
		channel.currentSong = null;
		channel.queue = [];
		channel.connection.dispatcher.end();
	}

	function disconnect(msg) {
		const channel = channels.get(msg.guild.id);
		msg.channel.send('🤟 **I\'m leaving, bye!** 🤟');
		channel.voiceChannel.leave();
		channels.delete(msg.guild.id);
	}
}
