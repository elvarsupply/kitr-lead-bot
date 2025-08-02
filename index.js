require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Import command modules
require('./commands/linkdrop')(bot);

// Start bot
bot.launch();
console.log('🤖 Bot is running...');