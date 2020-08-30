const Discord = require('discord.js');

module.exports = queue;

function queue(msg, channel) {
	const { queue } = channel;

	const songsInfo = new Discord.MessageEmbed()
		.setColor('#1283F0')
		.setTitle('🎶 QUEUE 🎶');
        

	if (channel.isPlaying) {
		songsInfo
			.setThumbnail(channel.currentSong.thumbnail)
			.addFields({
				name: '🎵 Now Playing:',
				value: `[${channel.currentSong.title}](${channel.currentSong.url}) \`${channel.currentSong.duration}\``
			});
	}

	queue.forEach((song, i) => {
		songsInfo.addFields({
			name: `\`${i + 1}.\` Requested by: **${song.requested}**`,
			value: `[${song.title}](${song.url}) \`${song.duration}\``,
		});
	});

	songsInfo.setFooter(`${queue.length} songs in queue.`);
	msg.channel.send(songsInfo);
}