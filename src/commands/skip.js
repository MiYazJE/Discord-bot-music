module.exports = skip;

function skip(msg, channel) {
	if (!msg.member.voice.channel) {
		return msg.channel.send('⛔ **You have to be in a voice channel to skip the music!**');
	}
	if (!channel.currentSong) {
		return msg.channel.send('⛔ **There is no songs to skip!**');
	}
	msg.channel.send(`⏭ **Skipping** \`${channel.currentSong.title}\``);
	channel.connection.dispatcher.end();
}