const { Telegraf } = require('telegraf');
const Telegram = require('telegraf/telegram');
const express = require('express');
const scraper = require('./scraper');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const app = express();

const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
app.use(bodyParser.urlencoded({ extended: true }));

var prevCAT = '';

cron.schedule('*/5 * * * *', async () => {
    await scraper.scrapCAT(process.env.WEB_LOGIN_URL)
        .then((message) => {
            if (message !== prevCAT && !message.includes('undefined')) {
                telegram
                    .sendMessage(process.env.CHANNEL_ID, message)
                    .then(console.log('cat status was sent'))
                    .catch((err) => console.log(err));

                prevCAT = message;
            };
        })
        .catch((err) => console.log(err));
});

cron.schedule('32 */1 * * *', async () => {
    await scraper.scrapPSI(process.env.WEB_LOGIN_URL)
        .then((message) => {
            if (process.env.RUN_PSI === 'yes') {
                telegram
                    .sendMessage(process.env.CHANNEL_ID, message)
                    .then(console.log('psi reading was sent'))
                    .catch((err) => console.log(err));
            };

        }).catch((err) => console.log(err));
});

app.get('/ping', (req, res) => {
  res.status(200).send('im awake');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening on port ${port}`));
