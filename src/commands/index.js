const stop = require('./stop');
const add = require('./add');
const dequeue = require('./dequeue');
const disconnect = require('./disconnect');
const join = require('./join');
const play = require('./play').default;
const queue = require('./queue');
const skip = require('./skip');

module.exports = {
	stop,
	add,
	dequeue,
	disconnect,
	join,
	play,
	queue,
	skip
};