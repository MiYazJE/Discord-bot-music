const youtubeScraper = require('./youtubeScraper');
const ytdl = require('ytdl-core');
const { connect } = require('puppeteer');

module.exports = musicBot;

const INITIAL_ROOM = {
	queue: [],
	isPlaying: false,
	volume: 5,
	connection: null,
	voiceChannel: null,
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

			if (msgParsed === 'add' || msgParsed === 'queue' || msgParsed === 'play') {
				await connect(msg);
			}

			switch (msgParsed) {
			case 'add':
				add(params, msg);
				break;
			case 'queue':
				getQueue(msg);
				break;
			case 'dequeue':
				dequeue(msg);
				break;
			case 'play':
				testPlay(msg);
				break;
			}
		});

		client.login(process.env.DISCORD_TOKEN);
	})();

	function getQueue(msg) {
		const channel = channels.get(msg.guild.id);
		const queue = channel ? channel.queue : [];

		let songs = `**        🎶 CURRENT QUEUE 🎶**\n
${queue.map((v, i) => `**#${i + 1}** '***\`${v.title}\`***'\n\n`).join('')}
		`;
		msg.channel.send(songs);
	}

	async function add(songName, msg) {
		if (!songName) {
			msg.channel.send('⛔ You must indicate a group name or a song name.');
			return;
		}

		const channel = channels.get(msg.guild.id);
		const song = await youtubeScraper.getSong(songName);

		channel.queue.push(song);
		channels.set(msg.guild.id, channel);
		msg.channel.send(`✅ *${song.title}* ***enqueued***`);
	}

	async function dequeue(msg) {
		const channel = channels.get(msg.guild.id);
		const queue = channel ? channel.queue : [];
		const video = queue.pop();
		if (!video) {
			msg.channel.send('⛔ **There is no videos for dequeue.**');
		} else {
			msg.channel.send(`⛔ ***\`${video.title}\`*** **has been removed.**`);
		}
	}

	async function connect(msg) {
		if (channels.has(msg.guild.id)) return;

		const channel = { ...INITIAL_ROOM };

		const voiceChannel = msg.member.voice.channel;
		channel.voiceChannel = voiceChannel;
		channels.set(msg.guild.id, channel);

		if (!voiceChannel) {
			return msg.channel.send('⛔ ***You need to be in a voice channel to play music!');
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

	function testPlay(msg) {
		const channel = channels.get(msg.guild.id);
		const song = channel.queue.shift();
		if (channel.isPlaying) {
			return msg.channel.send('**I\'m currently playing a song...**');
		}
		if (!song) {
			channel.isPlaying = false;
			return msg.channel.send('⛔ There isn\'t songs to play');
		}
		channel.isPlaying = true;
		play(msg, channel, song);
	}

	async function play(msg, channel, song) {
		if (!song) {
			channel.isPlaying = false;
			return;
		}

		const dispatcher = channel.connection
			.play(ytdl(song.url, { filter: 'audioonly' }))
			.on('finish', () => play(msg, channel, channel.queue.shift()))
			.on('error', (e) => console.log(e));
		
		msg.channel.send(`🎵 Playing ***${song.title}***\n${song.url}`);
		dispatcher.setVolumeLogarithmic(channel.volume / 5);
	}
}
