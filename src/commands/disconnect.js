module.exports = disconnect;

function disconnect(msg, channels) {
	const channel = channels.get(msg.guild.id);
	msg.channel.send('🤟 **I\'m leaving, bye!** 🤟');
	channel.voiceChannel.leave();
	channels.delete(msg.guild.id);
}