const Discord = require('discord.js');
const { MESSAGE_COLOR, SPACE } = require('./config');

module.exports = queue;

function queue(msg, channel) {
	const { queue } = channel;

	const songsInfo = new Discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle('🎶 QUEUE 🎶');
        
	if (channel.isPlaying) {
		songsInfo
			.setThumbnail(channel.currentSong.thumbnail)
			.addFields({
				name: SPACE,
				value: `
					🎵 Now Playing:
					[${channel.currentSong.title}](${channel.currentSong.url})
					*Duration:* \`${channel.currentSong.duration}\`
					*Requested by:* \`${channel.currentSong.requested}\`` 
			});
	}

	queue.forEach((song, i) => {
		songsInfo
			.addFields({
				name: SPACE,
				value: `
					**${i + 1}.** [${song.title}](${song.url}) 
					*Duration:* \`${song.duration}\`
					*Requested by:* \`${song.requested}\``
			});
	});

	songsInfo.setFooter(`${queue.length} songs in queue. | 🔄Bucle: ${channel.bucle ? 'ON' : 'OFF'}`);
	msg.channel.send(songsInfo);
}