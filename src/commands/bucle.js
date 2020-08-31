module.exports = bucle;

function bucle(msg, channel) {
	if (!msg.member.voice.channel) {
		return msg.channel.send('⛔️ **You need to be in a channel voice to set a bucle.**');
	}
    
	channel.bucle = !channel.bucle;
	msg.channel.send(`🔄 **Bucle: ** \`${channel.bucle ? 'ON' : 'OFF'}\``);
}