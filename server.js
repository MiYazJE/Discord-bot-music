const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const musicBot = require('./src/musicBot');
musicBot(client);