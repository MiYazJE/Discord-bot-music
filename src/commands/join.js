module.exports = join;

async function join(msg, channel) {
	if (channel.connection) {
		return msg.channel.send('⛔ **I am already in a channel voice**');
	}
	const voiceChannel = msg.member.voice.channel;
	channel.voiceChannel = voiceChannel;

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
	}
}