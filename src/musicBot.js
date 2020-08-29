const youtubeScraper = require('./youtubeScraper');

module.exports = musicBot;

function musicBot(client) {

	const queue = [];
	let isPlaying = false;
	let volume = 5;
    
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});
    
	client.on('message', msg => {
		console.log(msg.content);
        
		const args = msg.content.substring(1).split(' ');
		const msgParsed = args[0];
		const params = args.slice(1).join(' ');
        
		switch (msgParsed) {
		case 'add':
			add(params, msg);
			break;
		case 'queue':
			getQueue(msg);
			break;
		case 'dequeue':
			dequeue(msg);
			break;
		}
	});
    
	client.login(process.env.DISCORD_TOKEN);    

	function getQueue(msg) {
		let songs = `
			**🎶 Current queue**
			${queue.map((v, i) => `**#${i + 1}** ***\`${v.title}\`***\n`).join('')}
		`;
		msg.channel.send(songs);
	}
    
	async function add(song, msg) {
		const video = await youtubeScraper.getSong(song);
		queue.push(video);
		msg.channel.send(`🎵 *${video.title}* ***enqueued***`);
	}

	async function dequeue(msg) {
		const video = queue.pop();
		if (!video) {
			msg.channel.send('**There is no videos for dequeue.**');		
		}
		else {
			msg.channel.send(`❌ ***${video.title}*** **has been removed.**`);		
		}
	}
}