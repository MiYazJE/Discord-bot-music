const axios = require('axios');
const Discord = require('discord.js');
const { MESSAGE_COLOR, SPACE } = require('./config');

const URL_GET_SUGGESTIONS = 'http://youtube-scrap-service.herokuapp.com/api/v1/getVideos/';
const URL_YOUTUBE = 'https://www.youtube.com';

module.exports = search;

async function search(msg, q) {
	msg.channel.send(`🔎 **Searching**:  \`${q}\``);
    
	const { data } = await axios.get(`${URL_GET_SUGGESTIONS}${q}`);
	const suggestions = data.map(v => ({ ...v, url: `${URL_YOUTUBE}${v.url}` })).slice(0, 10);
    
	const suggestionsMessage = new Discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle('🔎 Results:');
        
	suggestions.forEach((s, i) => {
		suggestionsMessage
			.addField(
				SPACE,
				`**${i + 1}.** [${s.title}](${s.url}) \`${s.duration || ''}\`` 
			);
	});
    
	msg.channel.send(suggestionsMessage);
}