module.exports = stop;

function stop(msg, channel) {
	if (!msg.member.voice.channel) {
		return msg.channel.send('⛔ **You have to be in a voice channel to stop the music!**');
	}
	msg.channel.send('⏹ **Stopping the music...**');
	channel.isPlaying = false;
	channel.currentSong = null;
	channel.queue = [];
	channel.connection.dispatcher.end();
}