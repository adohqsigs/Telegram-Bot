// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const bot = new Composer;
const Telegram = require('telegraf/telegram')

const BOT_TOKEN = process.env.BOT_TOKEN;
// const bot = new Telegraf(BOT_TOKEN);
const telegram = new Telegram(BOT_TOKEN);
var started = false;
var fromChatId = '';
var chatId = '';

async function getChatName(id) {
  const chat = await telegram.getChat(id);
  return (chat.title)
};


bot.command('sourcechat', async (ctx) => {

  fromChatId = ctx.message.chat.id;
  ctx.reply(`*${await getChatName(fromChatId)}* chat will be the source`);

});

bot.command('targetchat', async (ctx) => {

  chatId = ctx.message.chat.id;
  ctx.reply(`*${await getChatName(chatId)}* chat will be the target`);

});

bot.command('startforwarding', async (ctx) => {

  if (!fromChatId) return ctx.reply('/sourcechat in chat to messages from before you /startforwarding');
  if (!chatId) return ctx.reply('/targetchat in chat to messages to before you /startforwarding');

  started = true;
  ctx.reply(`Messages from *${await getChatName(fromChatId)}* will now be forwarded to *${await getChatName(chatId)}*`)

});

bot.help((ctx) => {
  ctx.reply(`/sourcechat@msgdeflect_bot to set chat as source\n/targetchat@msgdeflect_bot to set chat as target\n/startforwarding@msgdeflect_bot to start forwarding messages sent in source chat to target chat\n/restart@msgdeflect_bot to reset target and source chats`)
})

bot.command('restart', (ctx) => {
  fromChatId = '';
  chatId = '';
  started = false;
  ctx.reply('sourcechat and targetchat have been reset')
});

bot.on('message', (ctx) => {
  if (ctx.message.chat.id === fromChatId && chatId) {
    if (started) {
      var message = ctx.message.text;
      var messageId = ctx.message.message_id;
      telegram.forwardMessage(chatId, fromChatId, messageId)
    }
    else {
      ctx.reply('This message was not forwarded. /startforwarding to start forwarding')
    }
  }
});
// https://morning-scrubland-32486.herokuapp.com/
// morning-scrubland-32486
module.exports = bot;
