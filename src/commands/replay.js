const { play } = require('./play');

module.exports = replay;

function replay(msg, channel) {
	if (!msg.member.voice.channel) {
		return msg.channel.send('⛔️ **To replay a song you must be in a channel voice.**');
	}

	const songToReplay = channel.currentSong 
		? channel.currentSong 
		: channel.queue.shift();

	if (!songToReplay) {
		msg.channel.send('⛔️ **There isn\'t songs to replay.**');
	}
	else {
		play(msg, channel, songToReplay);
	}
}