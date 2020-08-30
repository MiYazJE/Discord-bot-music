const axios = require('axios');

const URL_GET_SONGS = 'http://youtube-scrap-service.herokuapp.com/api/v1/getVideo/'; 

module.exports = add;

async function add(songName, msg, channel) {
	if (!songName) {
		msg.channel.send('⛔ You must indicate a group name or a song name.');
		return;
	}

	const { data } = await axios.get(`${URL_GET_SONGS}${songName}`);
	console.log(data);
	data.requested = msg.member.user.tag;
	channel.queue.push(data);

	msg.channel.send(`✅ *${data.title}* ***enqueued***`);
}