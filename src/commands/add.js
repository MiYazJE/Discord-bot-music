const axios = require('axios');
const Discord = require('discord.js');
const { MESSAGE_COLOR } = require('./config');

const URL_GET_SONGS = 'http://youtube-scrap-service.herokuapp.com/api/v1/getVideo/'; 

module.exports = add;

async function add(songName, msg, channel) {
	if (!songName) {
		msg.channel.send('⛔ You must indicate a group name or a song name.');
		return;
	}
	
	msg.channel.send(`🔎 **Searching**:  \`${songName}\``);
	const { data } = await axios.get(`${URL_GET_SONGS}${songName}`);
	data.requested = msg.member.user.tag;
	channel.queue.push(data);

	msg.channel.send(
		new Discord.MessageEmbed()
			.setColor(MESSAGE_COLOR)
			.setTitle('Adding:')
			.setThumbnail(data.thumbnail)
			.setDescription(`[${data.title}](${data.url}) \`${data.duration}\``)
			.setFooter(`Requested by: ${data.requested}`)
	);
}