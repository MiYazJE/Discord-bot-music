const Discord = require('discord.js');
const { MESSAGE_COLOR, SPACE } = require('./config');

module.exports = commands;

function commands(msg) {
	msg.channel.send(
		new Discord
			.MessageEmbed()
			.setColor(MESSAGE_COLOR)
			.setTitle('⚙️ ****COMMAND LIST**** ⚙️')
			.setDescription(`
                \`!join:\`       *Join to your voice channel*
                \`!add:\`        *Search a song in youtube and push it to the queue*
                \`!queue:\`      *Show the current queue*
                \`!dequeue:\`    *Pop the last song in the queue*
                \`!play:\`       *Start playing music*
                \`!skip:\`       *Skip the current song if its playing*
                \`!stop:\`       *Stop the music and remove the queue*
                \`!bucle:\`      *Toggle the bucle state*
                \`!repeat:\`     *Repeat the song that is currently playing*
                \`!search:\`     *Get a seggestions list*
                \`!disconnect:\` *The bot leaves*
            `)
	);
}
