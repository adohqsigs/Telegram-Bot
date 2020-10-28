const { Telegraf } = require('telegraf');
const Telegram = require('telegraf/telegram');
const express = require('express');
const scraper = require('./scraper');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const app = express();

const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.telegram.setWebhook(`${process.env.BOT_DOMAIN}/bot${process.env.BOT_TOKEN}`) // comment this out when hosting on local machine
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
app.use(bodyParser.urlencoded({ extended: true }));

var prevMessage = '';

// TODO:
// 1. anyone can send a post req, so need to authorize request
// 2. for 2 hour periods, every 5 mins, if cat status changed, send msg, else, do nothing.
// at end of 2 hour period, if cat status doesnt change, send msg.


cron.schedule('*/5 * * * *', async () => {
    await scraper.scrapWeb(process.env.WEB_LOGIN_URL)
        .then((message) => {
            if (message !== prevMessage) {
                telegram
                    .sendMessage(process.env.CHANNEL_ID, message) // req.body.Body
                    .then(console.log('message was sent'))
                    .catch((err) => console.log(err));

                prevMessage = message;
            };
        })
        .catch((err) => console.log(err));

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening on port ${port}`));
