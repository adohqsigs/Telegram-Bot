// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const bot = new Composer;
const Telegram = require('telegraf/telegram')

// const telegram = new Telegram('1364016845:AAEIYZHp7SD8A2BvDHl5m3r8G-I_QPqtBDA');
// const bot = new Telegraf('1364016845:AAEIYZHp7SD8A2BvDHl5m3r8G-I_QPqtBDA');

var started = false;
var chatId = '';



bot.start((ctx) => {
  chatId = ctx.channelPost.chat.id;
  console.log(chatId);
  telegram.sendMessage(chatId, `/startforwarding to begin forwarding messages from sms source\n/stop to stop forwarding sms messages\n*Make sure bot is added to chat or channel for this to work`);
});

bot.command('startforwarding', (ctx) => {
  chatId = ctx.channelPost.chat.id;
  console.log(chatId);
  started = true;
  ctx.reply(chatId, 'bot will now forward sms messages')
});


bot.command('stop', (ctx) => {
  chatId = ctx.channelPost.chat.id;
  console.log(chatId);
  started = false;
  ctx.reply(chatId, 'bot has stop forwarding sms messages')
});

bot.command('send', (ctx) => {
  telegram.sendMessage(process.env.CHANNEL_ID, 'message')
});

module.exports = bot;
// bot.launch();
