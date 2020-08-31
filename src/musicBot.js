const {
	stop,
	add,
	dequeue,
	disconnect,
	join,
	play,
	queue,
	skip,
	replay,
	bucle,
	search
} = require('./commands');

const INITIAL_CHANNEL = {
	queue: [],
	isPlaying: false,
	volume: 5,
	connection: null,
	voiceChannel: null,
	currentSong: null,
	bucle: false,
};

module.exports = musicBot;

function musicBot(client) {
	const channels = new Map();

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
			channel = { ...INITIAL_CHANNEL };
			channels.set(msg.guild.id, channel);
		}

		switch (msgParsed) {
		case 'add':
			add(params, msg, channel);
			break;
		case 'queue':
			queue(msg, channel);
			break;
		case 'dequeue':
			dequeue(msg, channel.queue);
			break;
		case 'play':
			play(msg, channel);
			break;
		case 'replay':
			replay(msg, channel);
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
		case 'bucle':
			bucle(msg, channel);
			break;
		case 'search':
			search(msg, params);
			break;
		case 'disconnect':
			disconnect(msg, channels);
			break;
		}
	});

	client.login(process.env.DISCORD_TOKEN);
}
