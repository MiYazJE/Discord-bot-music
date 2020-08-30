module.exports = dequeue;

async function dequeue(msg, queue) {
	const video = queue.pop();
	if (!video) {
		msg.channel.send('⛔ **There is no songs to dequeue.**');
	} else {
		msg.channel.send(`⛔ ***\`${video.title}\`*** **has been removed.**`);
	}
}