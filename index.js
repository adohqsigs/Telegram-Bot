// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const bot = new Composer;
const Telegram = require('telegraf/telegram')


// const bot = new Telegraf(BOT_TOKEN);

var started = false;
var chatId = '';



bot.start((ctx) => {
  ctx.channelPost(`/startforwarding to begin forwarding messages from sms source\n/stop to stop forwarding sms messages\nMake sure bot is added to chat or channel for this to work`);
});

bot.command('startforwarding', (ctx) => {
  chatId = ctx.message.chat.id;
  started = true;
  ctx.channelPost('bot will now forward sms messages')
});


bot.command('stop', (ctx) => {
  chatId = '';
  started = false;
  ctx.channelPost('bot has stop forwarding sms messages')
});


module.exports = bot;
